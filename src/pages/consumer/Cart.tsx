import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, MessageSquare, Send } from 'lucide-react';
import { ConsumerLayout } from '@/components/ConsumerLayout';
import { useUserStore } from '@/store/useUserStore';
import { orderService, sessionService } from '@/services/consumer.service';
import { Card } from '@/components/ui/Card';

export const Cart: React.FC = () => {
    const navigate = useNavigate();
    const { cart, activeSessionId, setSession, clearCart, removeFromCart, updateCartQuantity } = useUserStore();
    const [submitting, setSubmitting] = useState(false);

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleSubmitOrder = async () => {
        setSubmitting(true);
        try {
            let sessionId = activeSessionId;

            // If no session, create one (mocking table 1 for now)
            if (!sessionId) {
                const session = await sessionService.open(1);
                sessionId = String(session.id_sessao);
                setSession(sessionId);
            }

            const orderItems = cart.map(item => ({
                idProduto: Number(item.id),
                quantidade: item.quantity,
                observacao: item.note
            }));

            await orderService.create({
                idSessao: Number(sessionId),
                itens: orderItems
            });

            clearCart();
            navigate('/orders');
        } catch (error) {
            console.error("Failed to submit order:", error);
            alert("Failed to submit order. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <ConsumerLayout>
                <div id="cart-empty" className="flex flex-col items-center justify-center min-h-[70vh] px-8 text-center">
                    <div className="size-24 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6">
                        <Trash2 size={40} className="text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-black mb-2">Your cart is empty</h2>
                    <p className="text-gray-400 text-sm mb-10">Add some delicious items from the menu to start your order.</p>
                    <button
                        onClick={() => navigate('/explore')}
                        className="bg-[#e65c00] text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-[#e65c00]/30 active:scale-95 transition-all"
                    >
                        Browse Menu
                    </button>
                </div>
            </ConsumerLayout>
        );
    }

    return (
        <ConsumerLayout>
            {/* Header */}
            <div id="cart-header" className="sticky top-0 z-50 bg-white/95 dark:bg-[#1f1a16]/95 backdrop-blur-md px-4 py-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
                <button onClick={() => navigate(-1)} className="size-11 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 active:scale-90 transition-transform">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-black tracking-tight">Your Cart</h1>
                <span className="ml-auto bg-[#e65c00]/10 text-[#e65c00] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {cart.length} Items
                </span>
            </div>

            <div id="cart-content" className="p-4 space-y-4 pb-64">
                {cart.map((item) => (
                    <Card key={item.id} id={`cart-item-${item.id}`} className="p-4 relative overflow-hidden group">
                        <div className="flex gap-4">
                            <div className="size-20 rounded-xl bg-center bg-cover shrink-0 shadow-inner" style={{ backgroundImage: `url(${item.image})` }}></div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="font-extrabold text-sm leading-tight truncate">{item.name}</h3>
                                    <span className="text-[#e65c00] font-black text-sm shrink-0">R$ {(item.price * item.quantity).toFixed(2)}</span>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl p-1 gap-1">
                                        <button
                                            onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                                            className="size-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <Minus size={14} strokeWidth={3} />
                                        </button>
                                        <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                                        <button
                                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                            className="size-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <Plus size={14} strokeWidth={3} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors p-2"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        {item.note && (
                            <div className="mt-3 bg-blue-50/50 dark:bg-blue-900/10 p-2.5 rounded-xl flex gap-2 items-start">
                                <MessageSquare size={14} className="text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold italic line-clamp-1">"{item.note}"</p>
                            </div>
                        )}
                    </Card>
                ))}

                <button
                    onClick={() => navigate('/explore')}
                    className="w-full py-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl text-gray-400 text-xs font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    + Add More Items
                </button>
            </div>

            {/* Checkout Bar - Offset for Bottom Nav */}
            <div id="cart-checkout-bar" className="fixed bottom-24 left-4 right-4 bg-white/95 dark:bg-[#1f1a16]/95 backdrop-blur-xl border border-gray-100 dark:border-gray-800 p-5 rounded-[2.5rem] z-50 shadow-2xl">
                <div className="max-w-md mx-auto flex flex-col gap-4">
                    <div className="flex justify-between items-end px-2">
                        <div>
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-0.5">Order Total</span>
                            <span className="text-3xl font-black text-[#181410] dark:text-white">R$ {total.toFixed(2)}</span>
                        </div>
                        <p className="text-[10px] text-[#e65c00] font-black uppercase tracking-widest mb-1.5">Table 12</p>
                    </div>
                    <button
                        onClick={handleSubmitOrder}
                        disabled={submitting}
                        className="w-full bg-[#181410] hover:bg-black transition-all py-5.5 rounded-[2.5rem] text-white font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-2xl active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Send to Kitchen
                                <Send size={18} strokeWidth={2.5} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </ConsumerLayout>
    );
};
