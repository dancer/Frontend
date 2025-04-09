using Betting.Data;
using Betting.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Configure database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register AuthService
builder.Services.AddScoped<IAuthService, AuthService>();

// Register FootballDataService
builder.Services.AddScoped<IFootballDataService, FootballDataService>();

// Configure JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

// Configure Swagger - Always enabled
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { 
        Title = "FootballX API", 
        Version = "v1",
        Description = """
            Welcome to the FootballX API documentation. This API provides endpoints for:
            
            - User Authentication & Management
            - Football Match Data
            - Live Betting Operations
            - User Rankings & Statistics
            
            All timestamps are in UTC. Amounts are in decimal format.
            """,
        Contact = new OpenApiContact
        {
            Name = "FootballX Support",
            Email = "support@footballx.com",
            Url = new Uri("https://footballx.com/support")
        },
        License = new OpenApiLicense
        {
            Name = "FootballX License",
            Url = new Uri("https://footballx.com/license")
        }
    });
    
    // Configure JWT authentication in Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = """
            JWT Authorization header using the Bearer scheme.
            Enter 'Bearer' [space] and then your token in the text input below.
            Example: 'Bearer 12345abcdef'
            """,
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    // Add operation filters for better documentation
    c.EnableAnnotations();
    
    // Organize endpoints by tag
    c.TagActionsBy(api => new[] { api.GroupName ?? api.RelativePath.Split('/')[1].ToUpperInvariant() });
    
    // Custom response examples
    c.UseInlineDefinitionsForEnums();
    
    // Include XML comments if they exist
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

var app = builder.Build();

// Always enable Swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "FootballX API v1");
    c.RoutePrefix = "swagger";
    
    // Customize the UI
    c.DefaultModelsExpandDepth(-1); // Hide schemas by default
    c.DisplayRequestDuration(); // Show request duration
    c.EnableDeepLinking(); // Enable deep linking for better navigation
    c.EnableFilter(); // Enable filtering operations
    c.EnableTryItOutByDefault(); // Enable Try it out by default
    
    // Custom CSS for better readability
    c.InjectStylesheet("/swagger-custom.css");
    
    // Better organization
    c.EnableTryItOutByDefault();
    c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.List);
});

// Enable CORS before routing
app.UseCors();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated();
}

app.Run();