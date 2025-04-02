import { useState } from 'react';
import { useRouter } from 'next/router';
import { register } from '@/services/api';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';

export default function RegisterForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            await register(email, username, password);
            router.push('/login');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to register');
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
                Register
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
                label="Username"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
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

            <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
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
                {isLoading ? 'Registering...' : 'Register'}
            </Button>

            <Button
                variant="text"
                onClick={() => router.push('/login')}
                fullWidth
            >
                Already have an account? Login
            </Button>
        </Box>
    );
} 