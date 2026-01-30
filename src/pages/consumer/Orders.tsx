import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChefHat, CheckCircle2, History as HistoryIcon, Clock, ChevronRight, HelpCircle } from 'lucide-react';
import { ConsumerLayout } from '@/components/ConsumerLayout';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';
import { orderService } from '@/services/consumer.service';
import type { Order } from '@/types/api';
import { Card } from '@/components/ui/Card';



export const Orders: React.FC = () => {
    const navigate = useNavigate();
    const { activeSessionId } = useUserStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!activeSessionId) {
                setLoading(false);
                return;
            }
            try {
                const data = await orderService.listBySession(activeSessionId);
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [activeSessionId]);

    const sessionTotal = orders.reduce((acc, order) => {
        const orderTotal = (order.itens || []).reduce((sum, item) => sum + (item.valor_total || 0), 0);
        return acc + orderTotal;
    }, 0);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ENTREGUE': return <CheckCircle2 size={16} className="text-green-500" />;
            case 'EM_PREPARO': return <ChefHat size={16} className="text-blue-500 animate-pulse" />;
            case 'CRIADO': return <Clock size={16} className="text-orange-500" />;
            default: return <Clock size={16} className="text-gray-400" />;
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'ENTREGUE': return "bg-green-50 text-green-600 dark:bg-green-900/10 dark:text-green-400";
            case 'EM_PREPARO': return "bg-blue-50 text-blue-600 dark:bg-blue-900/10 dark:text-blue-400";
            case 'CRIADO': return "bg-orange-50 text-orange-600 dark:bg-orange-900/10 dark:text-orange-400";
            default: return "bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    return (
        <ConsumerLayout>
            {/* Header */}
            <div id="orders-header" className="sticky top-0 z-50 bg-white/95 dark:bg-[#1f1a16]/95 backdrop-blur-md px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="size-11 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 active:scale-90 transition-transform">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-black tracking-tight">Active Session</h1>
                            <p className="text-[10px] text-[#e65c00] font-black uppercase tracking-widest">Table 12 • 4 Guests</p>
                        </div>
                    </div>
                    <button className="size-11 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
                        <HelpCircle size={20} className="text-[#7A4C30]/40" />
                    </button>
                </div>
            </div>

            <div id="orders-content" className="p-4 space-y-10 pb-64 pt-6">
                {!activeSessionId ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <div className="size-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-200">
                            <Clock size={40} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-black text-gray-400">No active session</h2>
                            <p className="text-sm text-gray-300 font-medium px-8">Scan a QR Code to start your experience.</p>
                        </div>
                    </div>
                ) : loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="size-12 border-4 border-[#e65c00] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading your orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <div className="size-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-200">
                            <HistoryIcon size={40} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-black text-gray-400">No orders yet</h2>
                            <p className="text-sm text-gray-300 font-medium px-8">Browse the menu and place your first order.</p>
                        </div>
                        <button
                            onClick={() => navigate('/menu')}
                            className="bg-[#e65c00] text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-[#e65c00]/30 active:scale-95 transition-all"
                        >
                            Browse Menu
                        </button>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id_pedido} id={`order-group-${order.id_pedido}`} className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <HistoryIcon size={14} className="text-gray-300" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        {new Date(order.criado_em).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border",
                                    getStatusBadgeClass(order.status)
                                )}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {order.itens?.map((item) => (
                                    <Card key={item.id_pedido_item} id={`order-item-${item.id_pedido_item}`} className="p-3 border-none shadow-sm dark:bg-[#1f1a16]">
                                        <div className="flex gap-4">
                                            <div className="size-14 rounded-lg bg-center bg-cover shrink-0 bg-gray-100" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop)` }}></div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h3 className="font-extrabold text-sm truncate">{item.nome || 'Item'}</h3>
                                                    <span className="text-[#181410] dark:text-white font-black text-xs">R$ {item.valor_total.toFixed(2)}</span>
                                                </div>
                                                <div className="flex items-center justify-between mt-1">
                                                    <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest", getStatusBadgeClass(order.status))}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status}
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-bold">Qty: {item.quantidade}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))
                )}

                {activeSessionId && orders.length > 0 && (
                    <button
                        onClick={() => navigate('/menu')}
                        className="w-full bg-[#e65c00]/5 hover:bg-[#e65c00]/10 text-[#e65c00] font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all group"
                    >
                        Add More Items
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                )}
            </div>

            {/* Floating Pay Button */}
            {activeSessionId && sessionTotal > 0 && (
                <div id="orders-pay-bar" className="fixed bottom-24 left-4 right-4 z-40 bg-white/80 dark:bg-[#181410]/80 backdrop-blur-md rounded-3xl overflow-hidden">
                    <button
                        onClick={() => navigate('/bill')}
                        className="w-full bg-[#181410] text-white p-5 flex items-center justify-between shadow-2xl active:scale-95 transition-all border border-white/5"
                    >
                        <div className="flex flex-col items-start ml-2 text-left">
                            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[#e65c00] mb-0.5">Session Total</span>
                            <span className="text-xl font-black">R$ {sessionTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#e65c00] px-6 py-3 rounded-2xl">
                            <span className="text-[10px] font-black uppercase tracking-widest">Pay Bill</span>
                            <ChevronRight size={16} strokeWidth={3} />
                        </div>
                    </button>
                </div>
            )}
        </ConsumerLayout>
    );
};
