import { api } from '@/lib/api';
import type { User } from '@/types/api';

export const authService = {
    register: (data: any) => api.post('auth/register', { json: data }).json<{ user: User, token: string }>(),

    login: (data: any) => api.post('auth/login', { json: data }).json<{ user: User, token: string }>(),

    anonymous: () => api.post('auth/anonymous').json<{ user: User, token: string }>(),

    getMe: () => api.get('users/me').json<User>(),
};
