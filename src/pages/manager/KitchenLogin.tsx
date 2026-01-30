import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { ChefHat, Lock, ArrowRight, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

export const KitchenLogin: React.FC = () => {
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState('');
    const [pin, setPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login
        setTimeout(() => {
            navigate('/kitchen-production');
            setIsLoading(false);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-[#f8fafb] dark:bg-[#1a1f24] flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-8 space-y-8">
                <div className="text-center space-y-2">
                    <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ChefHat size={32} className="text-primary" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight">Kitchen Production</h1>
                    <p className="text-[#5d7f89] text-sm font-medium">Select your restaurant and enter credentials</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-[#5d7f89] uppercase tracking-widest ml-1">Restaurant</label>
                            <div className="relative">
                                <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5d7f89]" size={18} />
                                <select
                                    required
                                    value={restaurant}
                                    onChange={(e) => setRestaurant(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-[#2d343c] border border-gray-100 dark:border-gray-800 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                                >
                                    <option value="">Select Restaurant...</option>
                                    <option value="1">Gourmet Plaza - Downtown</option>
                                    <option value="2">Gourmet Plaza - Mall</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-[#5d7f89] uppercase tracking-widest ml-1">Kitchen PIN</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5d7f89]" size={18} />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••"
                                    maxLength={4}
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                                    className="w-full bg-gray-50 dark:bg-[#2d343c] border border-gray-100 dark:border-gray-800 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold tracking-[0.5em] focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !restaurant || pin.length < 4}
                        className={cn(
                            "w-full bg-primary text-white font-black py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95",
                            (isLoading || !restaurant || pin.length < 4) && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isLoading ? (
                            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Enter Production View
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-[11px] font-bold text-[#5d7f89] hover:text-primary transition-colors"
                    >
                        Return to Manager Dashboard
                    </button>
                </div>
            </Card>
        </div>
    );
};
