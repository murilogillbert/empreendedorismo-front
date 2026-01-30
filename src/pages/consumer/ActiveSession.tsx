import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    HelpCircle,
    CheckCircle2,
    ChefHat,
    History as HistoryIcon,
    Users as UsersIcon,
    ChevronRight,
    CreditCard,
    Receipt
} from 'lucide-react';
import { ConsumerLayout } from '@/components/ConsumerLayout';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';

interface SessionItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    status: 'PENDING' | 'PREPARING' | 'SERVED';
    note?: string;
    image: string;
}

const MOCK_ITEMS: SessionItem[] = [
    {
        id: '1',
        name: 'Truffle Parmesan Fries',
        price: 14.00,
        quantity: 1,
        status: 'SERVED',
        note: 'No parsley please',
        image: 'https://images.unsplash.com/photo-1630384066202-18d17d120593?q=80&w=1964&auto=format&fit=crop'
    },
    {
        id: '2',
        name: 'Signature Wagyu Burger',
        price: 24.00,
        quantity: 1,
        status: 'PREPARING',
        note: 'Medium rare, aged cheddar',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop'
    },
    {
        id: '3',
        name: 'Miso Glazed Salmon',
        price: 28.00,
        quantity: 1,
        status: 'PENDING',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2070&auto=format&fit=crop'
    }
];

export const ActiveSession: React.FC = () => {
    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);
    const [view, setView] = useState<'MY' | 'TABLE'>('MY');

    if (!user) {
        return (
            <ConsumerLayout>
                <div className="p-8 pt-24 text-center space-y-8">
                    <div className="size-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-300">
                        <Receipt size={40} />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-2xl font-black text-[#181410] dark:text-white">Access Denied</h2>
                        <p className="text-sm text-[#7A4C30]/50 font-semibold px-6 leading-relaxed">Please identify yourself to view your active bill and order status.</p>
                    </div>
                    <button
                        onClick={() => navigate('/auth')}
                        className="w-full bg-[#e65c00] text-white font-black py-4.5 rounded-[2rem] shadow-2xl shadow-[#e65c00]/20 active:scale-95 transition-all text-sm uppercase tracking-[0.2em]"
                    >
                        Identify Now
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="text-[10px] font-black text-[#7A4C30] uppercase tracking-widest hover:underline"
                    >
                        Back to Explore
                    </button>
                </div>
            </ConsumerLayout>
        );
    }

    return (
        <ConsumerLayout>
            {/* Header */}
            <div id="session-header" className="sticky top-0 z-40 bg-white/95 dark:bg-[#1f1a16]/95 backdrop-blur-md px-4 py-4 flex flex-col border-b border-gray-100 dark:border-gray-800">
                <div id="session-header-top" className="flex items-center justify-between mb-5">
                    <div id="session-header-info" className="flex items-center gap-3">
                        <button id="session-back-button" onClick={() => navigate(-1)} className="size-11 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div id="session-table-details">
                            <h1 id="session-title" className="text-xl font-black leading-tight tracking-tight">Active Session</h1>
                            <p id="session-subtitle" className="text-[10px] text-[#e65c00] font-black uppercase tracking-widest flex items-center gap-1.5">
                                Table 12 <span className="text-gray-300">•</span> 4 Guests
                            </p>
                        </div>
                    </div>
                    <button id="session-help-button" className="size-11 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
                        <HelpCircle size={20} className="text-[#7A4C30]/60" />
                    </button>
                </div>

                <div id="session-view-toggle" className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl flex relative shadow-inner">
                    <button
                        id="session-view-my"
                        onClick={() => setView('MY')}
                        className={cn(
                            "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all z-10",
                            view === 'MY' ? "bg-white dark:bg-zinc-700 text-[#e65c00] shadow-md" : "text-gray-400"
                        )}
                    >
                        My Orders
                    </button>
                    <button
                        id="session-view-table"
                        onClick={() => setView('TABLE')}
                        className={cn(
                            "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all z-10",
                            view === 'TABLE' ? "bg-white dark:bg-zinc-700 text-[#e65c00] shadow-md" : "text-gray-400"
                        )}
                    >
                        Table Orders
                    </button>
                </div>
            </div>

            <div id="session-content" className="pb-64 pt-6 px-4">
                {/* Session Stats */}
                <div id="session-stats-grid" className="grid grid-cols-2 gap-4 mb-8">
                    <Card id="session-stat-items" className="p-5 bg-white dark:bg-[#1f1a16] border-none shadow-sm flex flex-col gap-1">
                        <p className="text-[9px] uppercase font-black tracking-[0.2em] text-gray-400">Total Items</p>
                        <p className="text-2xl font-black text-[#181410] dark:text-white">06</p>
                    </Card>
                    <Card id="session-stat-prep" className="p-5 bg-white dark:bg-[#1f1a16] border-none shadow-sm flex flex-col gap-1">
                        <p className="text-[9px] uppercase font-black tracking-[0.2em] text-gray-400">Preparation</p>
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                            <p className="text-sm font-black text-blue-500">2 Cooking</p>
                        </div>
                    </Card>
                </div>

                {/* Items List */}
                <div id="session-items-section" className="space-y-6">
                    <div id="session-items-header" className="flex items-center justify-between px-1">
                        <h2 id="session-items-title" className="text-lg font-black tracking-tight">Your Items</h2>
                        <span id="session-items-timestamp" className="text-[#e65c00] text-[10px] font-black uppercase tracking-widest">Ordered 12:45 PM</span>
                    </div>

                    <div id="session-items-list" className="space-y-4">
                        {MOCK_ITEMS.map((item) => (
                            <div key={item.id} id={`session-item-${item.id}`} className="bg-white dark:bg-[#1f1a16] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4 transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2">
                                <div id={`session-item-img-${item.id}`} className="size-20 rounded-xl bg-center bg-cover shrink-0 shadow-inner" style={{ backgroundImage: `url(${item.image})` }}></div>
                                <div id={`session-item-details-${item.id}`} className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 id={`session-item-name-${item.id}`} className="font-extrabold text-sm leading-tight truncate">{item.name}</h3>
                                        <span id={`session-item-price-${item.id}`} className="text-[#e65c00] font-black text-sm shrink-0">R$ {item.price.toFixed(2)}</span>
                                    </div>
                                    {item.note && (
                                        <p id={`session-item-note-${item.id}`} className="text-[10px] text-gray-400 dark:text-white/40 mt-1 italic leading-tight">"{item.note}"</p>
                                    )}
                                    <div id={`session-item-footer-${item.id}`} className="mt-3 flex items-center justify-between">
                                        <div id={`session-item-status-${item.id}`} className={cn(
                                            "flex items-center gap-1.5 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-[0.1em]",
                                            item.status === 'SERVED' ? "bg-green-50 text-green-600 border-green-100" :
                                                item.status === 'PREPARING' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                    "bg-orange-50 text-orange-600 border-orange-100"
                                        )}>
                                            {item.status === 'SERVED' ? <CheckCircle2 size={12} strokeWidth={3} /> :
                                                item.status === 'PREPARING' ? <ChefHat size={12} strokeWidth={3} /> :
                                                    <HistoryIcon size={12} strokeWidth={3} />}
                                            {item.status}
                                        </div>
                                        <span id={`session-item-qty-${item.id}`} className="text-[9px] font-black text-gray-300 uppercase">Qty: {item.quantity}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table Members Section */}
                    <div id="session-members-section" className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-10 px-1">
                        <div id="session-members-header" className="flex items-center justify-between mb-5">
                            <h2 id="session-members-title" className="text-lg font-black tracking-tight">Table Members</h2>
                            <button id="session-members-view-all" className="text-[#e65c00] text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:underline">
                                View All <ChevronRight size={14} strokeWidth={3} />
                            </button>
                        </div>
                        <div id="session-members-scroll" className="flex gap-5 overflow-x-auto no-scrollbar pb-4 pt-2">
                            {[
                                { name: 'You', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop', me: true },
                                { name: 'Sarah', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop' },
                                { name: 'James', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop' },
                                { name: 'Anna', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop' }
                            ].map((m, i) => (
                                <div key={i} id={`session-member-${m.name.toLowerCase()}`} className="flex flex-col items-center gap-3 shrink-0 group">
                                    <div className={cn(
                                        "size-14 rounded-full ring-offset-2 dark:ring-offset-[#181410] overflow-hidden border-2 transition-transform group-active:scale-95 shadow-sm",
                                        m.me ? "ring-2 ring-[#e65c00] border-white dark:border-[#1f1a16]" : "border-transparent"
                                    )}>
                                        <img src={m.img} alt={m.name} className="size-full object-cover" />
                                    </div>
                                    <span className={cn("text-[10px] font-black uppercase tracking-[0.1em]", m.me ? "text-[#e65c00]" : "text-gray-400 group-hover:text-gray-600 transition-colors")}>
                                        {m.name}
                                    </span>
                                </div>
                            ))}
                            <button id="session-member-invite" className="flex flex-col items-center gap-3 shrink-0 group">
                                <div className="size-14 rounded-full border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-300 group-hover:bg-gray-50 transition-colors">
                                    <UsersIcon size={24} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Invite</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Bill Bar */}
            <div id="session-payment-bar" className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-12 duration-1000">
                <button id="session-pay-button" className="w-full bg-[#181410] hover:bg-black text-white rounded-[2.5rem] p-5 flex items-center justify-between shadow-2xl transition-all active:scale-95 border border-white/5 ring-8 ring-black/5 group">
                    <div id="session-bill-info" className="flex flex-col items-start ml-2">
                        <p id="session-bill-tag" className="text-[10px] uppercase font-black tracking-[0.2em] text-[#e65c00] mb-1">Final Total</p>
                        <p id="session-bill-amount" className="text-2xl font-black leading-none">R$ 66.00 <span className="text-xs font-normal opacity-40 ml-1.5">+ service</span></p>
                    </div>
                    <div id="session-pay-action" className="flex items-center gap-3 bg-[#e65c00] px-6 py-3.5 rounded-2xl shadow-xl shadow-[#e65c00]/25 group-hover:bg-orange-600 transition-colors">
                        <span className="text-xs font-black uppercase tracking-[0.15em]">Pay Now</span>
                        <CreditCard size={20} strokeWidth={2.5} />
                    </div>
                </button>
            </div>
        </ConsumerLayout>
    );
};
