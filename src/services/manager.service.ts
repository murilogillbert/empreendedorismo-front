import { api } from '@/lib/api';
import type { Restaurant, MenuItem, Ingredient } from '@/types/api';

export const managerService = {
    getRestaurants: () => api.get('manager/restaurants').json<{ restaurants: Restaurant[] }>().then(r => r.restaurants),

    updateSettings: (restaurantId: number, settings: any) =>
        api.patch(`manager/${restaurantId}/settings`, { json: settings }).json(),

    getStaff: (restaurantId: number) => api.get(`manager/${restaurantId}/staff`).json<{ staff: any[] }>().then(r => r.staff),

    addStaff: (restaurantId: number, data: { email: string, role: string }) =>
        api.post(`manager/${restaurantId}/staff`, { json: data }).json(),

    createMenuItem: (restaurantId: number, data: any) =>
        api.post(`manager/${restaurantId}/menu`, { json: data }).json<MenuItem>(),

    getMenuItem: (restaurantId: number, itemId: number) =>
        api.get(`manager/${restaurantId}/menu/${itemId}`).json<{ item: MenuItem }>().then(r => r.item),

    updateMenuItem: (restaurantId: number, itemId: number, data: any) =>
        api.patch(`manager/${restaurantId}/menu/${itemId}`, { json: data }).json<MenuItem>(),

    deleteMenuItem: (restaurantId: number, itemId: number) =>
        api.delete(`manager/${restaurantId}/menu/${itemId}`).json(),

    getIngredients: (restaurantId: number) =>
        api.get(`manager/${restaurantId}/ingredients`).json<{ ingredients: Ingredient[] }>().then(r => r.ingredients),

    getKitchenQueue: (restaurantId: number, sector: 'COZINHA' | 'BAR' = 'COZINHA') =>
        api.get(`kitchen/${restaurantId}/queue`, { searchParams: { setor: sector } }).json<{ queue: any[] }>().then(r => r.queue),

    updateKitchenStatus: (idFila: number, status: string) =>
        api.patch(`kitchen/queue/${idFila}`, { json: { status } }).json(),

    getDailyAnalytics: (restaurantId: number) =>
        api.get(`manager/${restaurantId}/analytics/daily`).json<{ success: boolean, revenue: number, guests: number, orders: number }>(),

    getPopularItems: (restaurantId: number) =>
        api.get(`manager/${restaurantId}/analytics/popular-items`).json<{ items: any[] }>().then(r => r.items),
};
