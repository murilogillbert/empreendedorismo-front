import { api } from '@/lib/api';
import type { Session, Order, Payment } from '@/types/api';

export const sessionService = {
    open: (idMesa: string | number) => api.post('sessions/open', { json: { idMesa } }).json<Session>(),
};

export const orderService = {
    create: (data: { idSessao: number, itens: { idProduto: number, quantidade: number, observacao?: string }[] }) =>
        api.post('orders', { json: data }).json<Order>(),

    listBySession: (sessionId: string | number) => api.get(`orders/session/${sessionId}`).json<{ orders: Order[] }>().then(r => r.orders),
};

export const paymentService = {
    getSessionBill: (sessionId: string | number) => api.get(`payments/session/${sessionId}`).json<{ total: number, items: any[] }>(),

    pay: (data: { idSessao: number, valor: number, metodo: string }) =>
        api.post('payments', { json: data }).json<Payment>(),
};
