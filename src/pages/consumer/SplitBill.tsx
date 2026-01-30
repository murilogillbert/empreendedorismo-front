import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Users, CreditCard, Copy, Check, Share2, Calculator } from 'lucide-react';
import { ConsumerLayout } from '@/components/ConsumerLayout';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export const SplitBill: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [copied, setCopied] = useState(false);
    const amountToDivide = (location.state as any)?.amount || 142.00;

    const [divisor, setDivisor] = useState(1);
    const [customAmount, setCustomAmount] = useState<string>('');

    const finalAmount = customAmount ? parseFloat(customAmount) : (amountToDivide / divisor);

    const handleCopyLink = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        alert("Link copied! Share it with your friends to pay.");
    };

    const handlePay = () => {
        alert(`Paying R$ ${finalAmount.toFixed(2)} via Credit Card (Mock)`);
        navigate('/explore');
    };

    return (
        <ConsumerLayout>
            <div id="split-header" className="sticky top-0 z-50 bg-white/95 dark:bg-[#1f1a16]/95 backdrop-blur-md px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="size-11 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 active:scale-90 transition-transform">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black tracking-tight">Payment Division</h1>
                </div>
            </div>

            <div id="split-content" className="p-4 space-y-8 pt-8 max-w-md mx-auto pb-64">
                {/* Amount to Divide */}
                <div className="text-center space-y-2">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Selected Amount</p>
                    <h2 className="text-4xl font-black text-[#181410] dark:text-white">R$ {amountToDivide.toFixed(2)}</h2>
                </div>

                {/* Division Controls */}
                <Card id="split-controls" className="p-6 border-none shadow-xl bg-white/50 dark:bg-[#1f1a16]/50 backdrop-blur-xl">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#7A4C30] uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Users size={12} /> Divide into equal parts
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {[1, 2, 3, 4].map(n => (
                                    <button
                                        key={n}
                                        onClick={() => { setDivisor(n); setCustomAmount(''); }}
                                        className={cn(
                                            "py-3 rounded-xl font-black text-xs transition-all active:scale-95",
                                            divisor === n && !customAmount ? "bg-[#e65c00] text-white shadow-lg shadow-[#e65c00]/20" : "bg-gray-50 dark:bg-gray-800 text-gray-400"
                                        )}
                                    >
                                        {n === 1 ? 'Myself' : `1/${n}`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-gray-800"></div></div>
                            <div className="relative flex justify-center"><span className="bg-white dark:bg-[#1f1a16] px-3 text-[9px] font-black text-gray-300 uppercase tracking-widest">or enter custom</span></div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#7A4C30] uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Calculator size={12} /> Custom Amount
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-300">R$</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold shadow-sm focus:ring-2 focus:ring-[#e65c00]/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Sharing Section */}
                <div id="split-sharing" className="space-y-4">
                    <p className="text-[10px] text-center font-black text-gray-400 uppercase tracking-widest">Invite others to pay</p>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCopyLink}
                            className="flex-1 bg-white dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 py-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest active:scale-95 transition-all"
                        >
                            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            {copied ? 'Copied' : 'Copy Link'}
                        </button>
                        <button className="flex-1 bg-white dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 py-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest active:scale-95 transition-all">
                            <Share2 size={18} />
                            Share
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Final Action Bar - Offset for Bottom Nav */}
            <div id="split-action-bar" className="fixed bottom-24 left-4 right-4 bg-white/95 dark:bg-[#1f1a16]/95 backdrop-blur-xl border border-gray-100 dark:border-gray-800 p-5 rounded-[2.5rem] z-50 shadow-2xl">
                <div className="max-w-md mx-auto flex flex-col gap-4">
                    <div className="flex justify-between items-end px-2">
                        <div>
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-0.5">Your Portion</span>
                            <span className="text-3xl font-black text-[#e65c00]">R$ {finalAmount.toFixed(2)}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[8px] text-gray-400 font-bold uppercase block">Secure Payment</span>
                            <span className="text-[10px] text-[#181410] dark:text-white font-black">VISA •••• 4242</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePay}
                        className="w-full bg-[#181410] hover:bg-black transition-all py-5.5 rounded-[2.5rem] text-white font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-2xl active:scale-95 group"
                    >
                        <CreditCard size={18} strokeWidth={2.5} />
                        Confirm & Pay Porton
                    </button>
                </div>
            </div>
        </ConsumerLayout>
    );
};
