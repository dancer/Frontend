import type { AppProps } from 'next/app';
import { UserProvider } from '@/contexts/UserContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/styles/theme';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <UserProvider>
                <Component {...pageProps} />
            </UserProvider>
        </ThemeProvider>
    );
} 