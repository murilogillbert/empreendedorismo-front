import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id?: string;
    name: string;
    email?: string;
    phone?: string;
    isGuest: boolean;
}

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    identify: (userData: User) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            identify: (userData) => set({
                user: userData,
                isAuthenticated: !userData.isGuest
            }),
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: 'utable-user-storage',
        }
    )
);
