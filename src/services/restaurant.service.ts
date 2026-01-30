import { api } from '@/lib/api';
import type { Restaurant, MenuItem, MenuCategory } from '@/types/api';

export const restaurantService = {
    list: () => api.get('restaurants').json<{ restaurants: Restaurant[] }>().then(r => r.restaurants),

    getById: (id: string | number) => api.get(`restaurants/${id}`).json<{ restaurant: Restaurant & { menu: MenuItem[] } }>().then(r => r.restaurant),

    getMenu: (restaurantId: string | number) => api.get(`manager/${restaurantId}/menu`).json<{ items: MenuItem[] }>().then(r => r.items),

    getCategories: (restaurantId: string | number) => api.get(`restaurants/${restaurantId}/categories`).json<{ categories: MenuCategory[] }>().then(r => r.categories),
};
