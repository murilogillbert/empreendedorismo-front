import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChefHat, CheckCircle2, History as HistoryIcon, Clock, ChevronRight, HelpCircle } from 'lucide-react';
import { ConsumerLayout } from '@/components/ConsumerLayout';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

const MOCK_SESSION_ORDERS = [
    {
        id: 'ord-1',
        time: '12:45 PM',
        status: 'SERVED',
        items: [
            { id: '1', name: 'Signature Margherita', price: 42.00, quantity: 1, status: 'SERVED', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2070&auto=format&fit=crop' },
            { id: '2', name: 'Classic Negroni', price: 32.00, quantity: 2, status: 'SERVED', image: 'https://images.unsplash.com/photo-1541546106583-fbc52248296d?q=80&w=2070&auto=format&fit=crop' }
        ]
    },
    {
        id: 'ord-2',
        time: '01:15 PM',
        status: 'COOKING',
        items: [
            { id: '3', name: 'Truffle Fries', price: 18.00, quantity: 1, status: 'COOKING', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1974&auto=format&fit=crop' }
        ]
    }
];

export const Orders: React.FC = () => {
    const navigate = useNavigate();

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SERVED': return <CheckCircle2 size={16} className="text-green-500" />;
            case 'COOKING': return <ChefHat size={16} className="text-blue-500 animate-pulse" />;
            default: return <Clock size={16} className="text-orange-500" />;
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'SERVED': return "bg-green-50 text-green-600 dark:bg-green-900/10 dark:text-green-400";
            case 'COOKING': return "bg-blue-50 text-blue-600 dark:bg-blue-900/10 dark:text-blue-400";
            default: return "bg-orange-50 text-orange-600 dark:bg-orange-900/10 dark:text-orange-400";
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
                {MOCK_SESSION_ORDERS.map((order) => (
                    <div key={order.id} id={`order-group-${order.id}`} className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <HistoryIcon size={14} className="text-gray-300" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{order.time}</span>
                            </div>
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border",
                                order.status === 'SERVED' ? "border-green-100 text-green-600" : "border-blue-100 text-blue-600"
                            )}>
                                {order.status}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {order.items.map((item) => (
                                <Card key={item.id} id={`order-item-${item.id}`} className="p-3 border-none shadow-sm dark:bg-[#1f1a16]">
                                    <div className="flex gap-4">
                                        <div className="size-14 rounded-lg bg-center bg-cover shrink-0" style={{ backgroundImage: `url(${item.image})` }}></div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-extrabold text-sm truncate">{item.name}</h3>
                                                <span className="text-[#181410] dark:text-white font-black text-xs">R$ {item.price.toFixed(2)}</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest", getStatusBadgeClass(item.status))}>
                                                    {getStatusIcon(item.status)}
                                                    {item.status}
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-bold">Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}

                <button
                    onClick={() => navigate('/menu')}
                    className="w-full bg-[#e65c00]/5 hover:bg-[#e65c00]/10 text-[#e65c00] font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all group"
                >
                    Add More Items
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Floating Pay Button */}
            <div id="orders-pay-bar" className="fixed bottom-24 left-4 right-4 z-40">
                <button
                    onClick={() => navigate('/bill')}
                    className="w-full bg-[#181410] text-white rounded-3xl p-5 flex items-center justify-between shadow-2xl active:scale-95 transition-all border border-white/5"
                >
                    <div className="flex flex-col items-start ml-2 text-left">
                        <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[#e65c00] mb-0.5">Session Total</span>
                        <span className="text-xl font-black">R$ 142.00</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#e65c00] px-6 py-3 rounded-2xl">
                        <span className="text-[10px] font-black uppercase tracking-widest">Pay Bill</span>
                        <ChevronRight size={16} strokeWidth={3} />
                    </div>
                </button>
            </div>
        </ConsumerLayout>
    );
};
