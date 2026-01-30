import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Clock,
    CheckCircle2,
    Timer,
    ChefHat,
    Monitor,
    Search
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { managerService } from '@/services/manager.service';
import { useUserStore } from '@/store/useUserStore';


interface KitchenOrder {
    id_fila: number;
    id_pedido_item: number;
    mesa: string;
    nome: string;
    quantidade: number;
    observacao?: string;
    status: 'PENDENTE' | 'PREPARANDO' | 'PRONTO' | 'ENTREGUE';
    criado_em: string;
    setor: string;
}



export const KitchenProduction: React.FC = () => {
    const navigate = useNavigate();
    const { managerActiveRestaurantId } = useUserStore();
    const [viewMode, setViewMode] = useState<'PRODUCTION' | 'MONITOR'>('PRODUCTION');
    const [orders, setOrders] = useState<KitchenOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSector, setActiveSector] = useState<'COZINHA' | 'BAR'>('COZINHA');

    const fetchQueue = useCallback(async () => {
        if (!managerActiveRestaurantId) return;
        try {
            const data = await managerService.getKitchenQueue(managerActiveRestaurantId, activeSector);
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch kitchen queue:", error);
        } finally {
            setLoading(false);
        }
    }, [managerActiveRestaurantId, activeSector]);

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [fetchQueue]);

    const updateStatus = async (idFila: number, nextStatus: KitchenOrder['status']) => {
        try {
            await managerService.updateKitchenStatus(idFila, nextStatus);
            // Optimistic update
            setOrders(prev => prev.map(o => o.id_fila === idFila ? { ...o, status: nextStatus } : o));
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update status.");
            fetchQueue();
        }
    };

    const filteredOrders = orders.filter(o =>
        String(o.id_pedido_item).includes(searchTerm) ||
        o.mesa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTimeAgo = (dateStr: string) => {
        const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 60000);
        return `${diff}m`;
    };

    return (
        <div className="min-h-screen bg-[#f8fafb] dark:bg-[#1a1f24]">
            {/* Header */}
            <header className="bg-white dark:bg-[#21272e] border-b border-gray-100 dark:border-gray-800 px-6 py-4 sticky top-0 z-30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-[1600px] mx-auto">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 bg-gray-50 dark:bg-[#2d343c] rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-black tracking-tight">Production Line</h1>
                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full">Gourmet Plaza - Downtown</span>
                            </div>
                            <p className="text-[#5d7f89] text-xs font-medium">Real-time order fulfillment status</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5d7f89]" size={16} />
                            <input
                                type="text"
                                placeholder="Search by Item or Table..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-gray-50 dark:bg-[#2d343c] border border-gray-100 dark:border-gray-800 rounded-xl py-2 pl-10 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
                            />
                        </div>

                        {/* Sector Switcher */}
                        <div className="flex items-center bg-gray-50 dark:bg-[#2d343c] p-1 rounded-xl ml-2">
                            <button
                                onClick={() => setActiveSector('COZINHA')}
                                className={cn(
                                    "px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all",
                                    activeSector === 'COZINHA' ? "bg-white dark:bg-gray-800 text-primary shadow-sm" : "text-[#5d7f89]"
                                )}
                            >
                                Kitchen
                            </button>
                            <button
                                onClick={() => setActiveSector('BAR')}
                                className={cn(
                                    "px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all",
                                    activeSector === 'BAR' ? "bg-white dark:bg-gray-800 text-primary shadow-sm" : "text-[#5d7f89]"
                                )}
                            >
                                Bar
                            </button>
                        </div>

                        <div className="h-10 border-l border-gray-100 dark:border-gray-800 mx-2 hidden sm:block" />

                        {/* View Switcher */}
                        <div className="flex items-center bg-gray-50 dark:bg-[#2d343c] p-1 rounded-xl">
                            <button
                                onClick={() => setViewMode('PRODUCTION')}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all",
                                    viewMode === 'PRODUCTION' ? "bg-white dark:bg-gray-800 text-primary shadow-sm" : "text-[#5d7f89]"
                                )}
                            >
                                <ChefHat size={14} />
                                Production
                            </button>
                            <button
                                onClick={() => setViewMode('MONITOR')}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all",
                                    viewMode === 'MONITOR' ? "bg-white dark:bg-gray-800 text-primary shadow-sm" : "text-[#5d7f89]"
                                )}
                            >
                                <Monitor size={14} />
                                Monitor
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="p-6 max-w-[1600px] mx-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-4">
                        <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Loading Queue...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Column: PENDENTE */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-1">
                                <div className="size-2 rounded-full bg-orange-500 animate-pulse" />
                                <h2 className="text-xs font-black text-[#5d7f89] uppercase tracking-widest">Awaiting Prep ({orders.filter(o => o.status === 'PENDENTE').length})</h2>
                            </div>
                            {filteredOrders.filter(o => o.status === 'PENDENTE').map(order => (
                                <OrderCard key={order.id_fila} order={order} onAction={() => updateStatus(order.id_fila, 'PREPARANDO')} actionLabel="Start Prep" viewMode={viewMode} timeAgo={getTimeAgo(order.criado_em)} />
                            ))}
                        </div>

                        {/* Column: PREPARANDO */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-1">
                                <div className="size-2 rounded-full bg-primary" />
                                <h2 className="text-xs font-black text-[#5d7f89] uppercase tracking-widest">Preparing ({orders.filter(o => o.status === 'PREPARANDO').length})</h2>
                            </div>
                            {filteredOrders.filter(o => o.status === 'PREPARANDO').map(order => (
                                <OrderCard key={order.id_fila} order={order} onAction={() => updateStatus(order.id_fila, 'PRONTO')} actionLabel="Mark as Ready" viewMode={viewMode} variant="primary" timeAgo={getTimeAgo(order.criado_em)} />
                            ))}
                        </div>

                        {/* Column: PRONTO */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-1">
                                <div className="size-2 rounded-full bg-green-500" />
                                <h2 className="text-xs font-black text-[#5d7f89] uppercase tracking-widest">Ready for Pickup ({orders.filter(o => o.status === 'PRONTO').length})</h2>
                            </div>
                            {filteredOrders.filter(o => o.status === 'PRONTO').map(order => (
                                <OrderCard key={order.id_fila} order={order} onAction={() => updateStatus(order.id_fila, 'ENTREGUE')} actionLabel="Delivered" viewMode={viewMode} variant="success" timeAgo={getTimeAgo(order.criado_em)} />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const OrderCard: React.FC<{
    order: KitchenOrder,
    onAction: () => void,
    actionLabel: string,
    viewMode: 'PRODUCTION' | 'MONITOR',
    timeAgo: string,
    variant?: 'default' | 'primary' | 'success',
    isLastStep?: boolean
}> = ({ order, onAction, actionLabel, viewMode, timeAgo, variant = 'default', isLastStep }) => {
    return (
        <Card className={cn(
            "p-0 overflow-hidden border-2 transition-all hover:shadow-xl",
            variant === 'primary' ? "border-primary/20" : variant === 'success' ? "border-green-100 dark:border-green-900/20" : "border-gray-50 dark:border-gray-800"
        )}>
            <div className={cn(
                "px-5 py-4 border-b flex items-center justify-between",
                variant === 'primary' ? "bg-primary/5 border-primary/10" : variant === 'success' ? "bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20" : "bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800"
            )}>
                <div className="flex items-center gap-3">
                    <span className="text-lg font-black tracking-tight">#{order.id_pedido_item}</span>
                    <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-md text-[9px] font-black uppercase">{order.mesa}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#5d7f89]">
                    <Clock size={12} />
                    {timeAgo}
                </div>
            </div>

            <div className="p-5 space-y-4">
                <div className="space-y-3">
                    <div className="flex gap-3">
                        <div className="flex-shrink-0 size-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-black text-primary border border-gray-200 dark:border-gray-700">
                            {order.quantidade}x
                        </div>
                        <div>
                            <p className="text-sm font-bold leading-tight">{order.nome}</p>
                            {order.observacao && (
                                <p className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-md mt-1 italic">
                                    Note: {order.observacao}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {viewMode === 'PRODUCTION' && !isLastStep && (
                    <button
                        onClick={onAction}
                        className={cn(
                            "w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 mt-2",
                            variant === 'primary' ? "bg-green-600 text-white shadow-lg shadow-green-600/20 hover:bg-green-700" : "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
                        )}
                    >
                        {variant === 'primary' ? <CheckCircle2 size={16} /> : <Timer size={16} />}
                        {actionLabel}
                    </button>
                )}
            </div>
        </Card>
    );
};
