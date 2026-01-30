import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/auth.service';
import type { User as ApiUser } from '@/types/api';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    note?: string;
}

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
    activeSessionId: string | null;
    currentRestaurantId: string | null;
    managerActiveRestaurantId: number | null;
    savedRestaurants: string[];
    cart: CartItem[];
    token: string | null;
    identify: (userData: User, token?: string) => void;
    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    anonymousLogin: () => Promise<void>;
    fetchMe: () => Promise<void>;
    logout: () => void;
    setSession: (sessionId: string | null) => void;
    setCurrentRestaurant: (restaurantId: string | null) => void;
    setManagerActiveRestaurant: (restaurantId: number | null) => void;
    toggleSavedRestaurant: (restaurantId: string) => void;
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    updateCartQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
}

const mapApiUserToStoreUser = (apiUser: ApiUser, isGuest: boolean): User => ({
    id: String(apiUser.id_usuario),
    name: apiUser.nome_completo,
    email: apiUser.email,
    phone: apiUser.telefone,
    isGuest
});

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            activeSessionId: null,
            currentRestaurantId: null,
            managerActiveRestaurantId: null,
            savedRestaurants: [],
            cart: [],
            token: null,

            identify: (userData, token) => {
                if (token) localStorage.setItem('token', token);
                set({
                    user: userData,
                    isAuthenticated: !userData.isGuest,
                    token: token || null
                });
            },

            login: async (credentials) => {
                const { user, token } = await authService.login(credentials);
                localStorage.setItem('token', token);
                set({
                    user: mapApiUserToStoreUser(user, false),
                    token,
                    isAuthenticated: true
                });
            },

            register: async (data) => {
                const { user, token } = await authService.register(data);
                localStorage.setItem('token', token);
                set({
                    user: mapApiUserToStoreUser(user, false),
                    token,
                    isAuthenticated: true
                });
            },

            anonymousLogin: async () => {
                const { user, token } = await authService.anonymous();
                localStorage.setItem('token', token);
                set({
                    user: mapApiUserToStoreUser(user, true),
                    token,
                    isAuthenticated: false
                });
            },

            fetchMe: async () => {
                try {
                    const user = await authService.getMe();
                    set({
                        user: mapApiUserToStoreUser(user, false),
                        isAuthenticated: true
                    });
                } catch (e) {
                    set({ user: null, isAuthenticated: false, token: null });
                    localStorage.removeItem('token');
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                set({
                    user: null,
                    isAuthenticated: false,
                    activeSessionId: null,
                    currentRestaurantId: null,
                    managerActiveRestaurantId: null,
                    savedRestaurants: [],
                    cart: [],
                    token: null
                });
            },

            setSession: (activeSessionId) => set({ activeSessionId }),
            setCurrentRestaurant: (currentRestaurantId) => set({ currentRestaurantId }),
            setManagerActiveRestaurant: (restaurantIdValue) => set({ managerActiveRestaurantId: restaurantIdValue }),

            toggleSavedRestaurant: (id) => set((state) => ({
                savedRestaurants: state.savedRestaurants.includes(id)
                    ? state.savedRestaurants.filter(rid => rid !== id)
                    : [...state.savedRestaurants, id]
            })),

            addToCart: (item) => set((state) => {
                const existing = state.cart.find(i => i.id === item.id);
                if (existing) {
                    return {
                        cart: state.cart.map(i => i.id === item.id
                            ? { ...i, quantity: i.quantity + item.quantity }
                            : i
                        )
                    };
                }
                return { cart: [...state.cart, item] };
            }),

            removeFromCart: (itemId) => set((state) => ({
                cart: state.cart.filter(i => i.id !== itemId)
            })),

            updateCartQuantity: (itemId, quantity) => set((state) => ({
                cart: state.cart.map(i => i.id === itemId ? { ...i, quantity } : i)
            })),

            clearCart: () => set({ cart: [] }),
        }),
        {
            name: 'utable-user-storage',
        }
    )
);
