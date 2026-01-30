import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, ChevronRight, Split, Info, CheckCircle2 } from 'lucide-react';
import { ConsumerLayout } from '@/components/ConsumerLayout';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';
import { orderService, paymentService } from '@/services/consumer.service';
import type { Order } from '@/types/api';



export const Bill: React.FC = () => {
    const navigate = useNavigate();
    const { activeSessionId, setSession } = useUserStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isSplitMode, setIsSplitMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

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
                console.error("Failed to fetch bill data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [activeSessionId]);

    // Flatten all items from all orders
    const allItems = orders.flatMap(order => (order.itens || []).map(item => ({
        ...item,
        status: order.status
    })));

    const subtotal = allItems.reduce((acc, item) => acc + (item.valor_total || 0), 0);
    const serviceFee = subtotal * 0.1;
    const grandTotal = subtotal + serviceFee;

    const selectedTotal = allItems
        .filter(item => selectedItems.includes(item.id_pedido_item))
        .reduce((acc, item) => acc + (item.valor_total || 0), 0);

    const toggleItemSelection = (id: number) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleCheckout = async () => {
        if (!activeSessionId) return;
        setSubmitting(true);
        try {
            const amount = isSplitMode ? selectedTotal + (selectedTotal * 0.1) : grandTotal;

            await paymentService.pay({
                idSessao: Number(activeSessionId),
                valor: amount,
                metodo: 'CARTAO', // Default for now
            });

            // If not split mode or if all items were selected (simulated), close session
            if (!isSplitMode || selectedItems.length === allItems.length) {
                setSession(null);
                alert("Thank you! Your payment was successful and the session is closed.");
                navigate('/');
            } else {
                alert(`Payment of R$ ${amount.toFixed(2)} successful! Session remains open for other items.`);
                setSelectedItems([]);
                // Refresh orders
                const data = await orderService.listBySession(activeSessionId);
                setOrders(data);
            }
        } catch (error) {
            console.error("Payment failed:", error);
            alert("Payment failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <ConsumerLayout>
            {/* Header */}
            <div id="bill-header" className="sticky top-0 z-50 bg-white/95 dark:bg-[#1f1a16]/95 backdrop-blur-md px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="size-11 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 active:scale-90 transition-transform">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-black tracking-tight">Final Bill</h1>
                    </div>
                    <div className="flex items-center gap-2 bg-[#e65c00]/10 px-3 py-1.5 rounded-xl">
                        <Users size={14} className="text-[#e65c00]" />
                        <span className="text-[10px] font-black text-[#e65c00] uppercase tracking-widest">Table 12</span>
                    </div>
                </div>
            </div>

            <div id="bill-content" className="p-4 space-y-6 pb-64 pt-6">
                {/* Mode Toggle */}
                <div id="bill-mode-toggle" className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl flex relative shadow-inner">
                    <button
                        onClick={() => { setIsSplitMode(false); setSelectedItems([]); }}
                        className={cn(
                            "flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all z-10 flex items-center justify-center gap-2",
                            !isSplitMode ? "bg-white dark:bg-zinc-700 text-[#e65c00] shadow-md" : "text-gray-400"
                        )}
                    >
                        <CheckCircle2 size={14} /> Full Bill
                    </button>
                    <button
                        onClick={() => setIsSplitMode(true)}
                        className={cn(
                            "flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all z-10 flex items-center justify-center gap-2",
                            isSplitMode ? "bg-white dark:bg-zinc-700 text-[#e65c00] shadow-md" : "text-gray-400"
                        )}
                    >
                        <Split size={14} /> Split Items
                    </button>
                </div>

                {isSplitMode && (
                    <div id="split-instruction" className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl flex gap-3 border border-blue-100 dark:border-blue-900/20 animate-in fade-in slide-in-from-top-2">
                        <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold leading-relaxed">
                            Select the items you want to pay for or divide with others.
                        </p>
                    </div>
                )}

                {/* Items List */}
                <div id="bill-items-list" className="space-y-3">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="size-12 border-4 border-[#e65c00] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading bill details...</p>
                        </div>
                    ) : allItems.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 font-bold text-sm">No items found for this session.</div>
                    ) : (
                        allItems.map((item) => (
                            <div
                                key={item.id_pedido_item}
                                id={`bill-item-${item.id_pedido_item}`}
                                onClick={() => isSplitMode && toggleItemSelection(item.id_pedido_item)}
                                className={cn(
                                    "p-4 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer",
                                    isSplitMode && selectedItems.includes(item.id_pedido_item)
                                        ? "bg-[#e65c00]/5 border-[#e65c00] shadow-lg shadow-[#e65c00]/5"
                                        : "bg-white dark:bg-[#1f1a16] border-gray-100 dark:border-gray-800"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    {isSplitMode && (
                                        <div className={cn(
                                            "size-6 rounded-full border-2 transition-all flex items-center justify-center",
                                            selectedItems.includes(item.id_pedido_item) ? "bg-[#e65c00] border-[#e65c00]" : "border-gray-200 dark:border-gray-700"
                                        )}>
                                            {selectedItems.includes(item.id_pedido_item) && <CheckCircle2 size={14} className="text-white" />}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-extrabold text-sm text-[#181410] dark:text-white">{item.nome || 'Item'}</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Qty: {item.quantidade}</p>
                                    </div>
                                </div>
                                <span className={cn(
                                    "font-black text-sm transition-colors",
                                    selectedItems.includes(item.id_pedido_item) ? "text-[#e65c00]" : "text-[#181410] dark:text-white"
                                )}>
                                    R$ {item.valor_total.toFixed(2)}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Totals Summary */}
                <div id="bill-summary" className="mt-8 space-y-3 px-2 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <span>Subtotal</span>
                        <span>R$ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <span>Service (10%)</span>
                        <span>R$ {serviceFee.toFixed(2)}</span>
                    </div>
                    {isSplitMode && (
                        <div className="flex justify-between text-xs font-black text-[#e65c00] uppercase tracking-[0.2em] pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                            <span>Selected Items</span>
                            <span>R$ {selectedTotal.toFixed(2)}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Final Action Bar - Offset for Bottom Nav */}
            <div id="bill-action-bar" className="fixed bottom-24 left-4 right-4 bg-white/95 dark:bg-[#1f1a16]/95 backdrop-blur-xl border border-gray-100 dark:border-gray-800 p-5 rounded-[2.5rem] z-50 shadow-2xl">
                <div className="max-w-md mx-auto flex flex-col gap-4">
                    <div className="flex justify-between items-end px-2">
                        <div>
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-0.5">
                                {isSplitMode ? 'Selected Total' : 'Total to Pay'}
                            </span>
                            <span className="text-3xl font-black text-[#181410] dark:text-white">
                                R$ {(isSplitMode ? selectedTotal + (selectedTotal * 0.1) : grandTotal).toFixed(2)}
                            </span>
                        </div>
                        {isSplitMode && (
                            <span className="text-[10px] text-gray-400 font-bold mb-1.5 italic">+ service fee</span>
                        )}
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={submitting || allItems.length === 0}
                        className="w-full bg-[#181410] hover:bg-black transition-all py-5.5 rounded-[2.5rem] text-white font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-2xl active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                {isSplitMode ? 'Finalize Split Payment' : 'Checkout Now'}
                                <ChevronRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </ConsumerLayout>
    );
};
