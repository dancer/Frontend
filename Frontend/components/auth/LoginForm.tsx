import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '@/services/api';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 400,
                mx: 'auto',
                p: 3,
            }}
        >
            <Typography variant="h5" component="h1" gutterBottom>
                Login
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                fullWidth
            />

            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                fullWidth
            />

            <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                fullWidth
                sx={{ mt: 2 }}
            >
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <Button
                variant="text"
                onClick={() => router.push('/register')}
                fullWidth
            >
                Don't have an account? Register
            </Button>
        </Box>
    );
} 