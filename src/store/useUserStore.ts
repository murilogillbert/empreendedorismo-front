import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    savedRestaurants: string[];
    cart: CartItem[];
    identify: (userData: User) => void;
    logout: () => void;
    setSession: (sessionId: string | null) => void;
    setCurrentRestaurant: (restaurantId: string | null) => void;
    toggleSavedRestaurant: (restaurantId: string) => void;
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    updateCartQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            activeSessionId: null, // Scanned QR code or active reservation
            currentRestaurantId: null, // Restaurant being browsed
            savedRestaurants: [],
            cart: [],
            identify: (userData) => set({
                user: userData,
                isAuthenticated: !userData.isGuest
            }),
            logout: () => set({ user: null, isAuthenticated: false, activeSessionId: null, currentRestaurantId: null, savedRestaurants: [], cart: [] }),
            setSession: (activeSessionId) => set({ activeSessionId }),
            setCurrentRestaurant: (currentRestaurantId) => set({ currentRestaurantId }),
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
