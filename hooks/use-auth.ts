'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export function useAuth() {
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('leaply_admin_token');
        if (token) {
            // In a real app, we might verify this token or get user profile
            // For this one-admin account app, we just assume the token is valid if it exists
            // The interceptor will handle expiry later.
            setUser({ username: 'admin' });
        }
        setIsLoading(false);
    }, []);

    const login = (token: string) => {
        localStorage.setItem('leaply_admin_token', token);
        setUser({ username: 'admin' });
        router.push('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('leaply_admin_token');
        setUser(null);
        router.push('/login');
    };

    return { user, isLoading, login, logout, isAuthenticated: !!user };
}
