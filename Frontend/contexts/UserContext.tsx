import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser, UserProfile } from '@/services/api';

interface UserContextType {
    user: UserProfile | null;
    setUser: (user: UserProfile | null) => void;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        getCurrentUser()
            .then((userData) => {
                setUser(userData);
            })
            .catch(() => {
                localStorage.removeItem('token');
                router.push('/login');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [router]);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
} 