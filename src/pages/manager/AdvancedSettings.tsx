import React from 'react';
import { ChevronLeft, Percent, Wallet, Clock, Settings2, Info, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ManagerLayout } from '@/components/ManagerLayout';
import { Card } from '@/components/ui/Card';

export const AdvancedSettings: React.FC = () => {
    const navigate = useNavigate();

    return (
        <ManagerLayout>
            <header className="pt-2 pb-6 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 bg-white dark:bg-[#2d343c] rounded-xl border border-gray-100 dark:border-gray-800 soft-shadow"
                >
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-extrabold tracking-tight">Advanced Settings</h1>
                    <p className="text-[#5d7f89] text-xs">Configure granular store policies</p>
                </div>
            </header>

            <div className="space-y-6">
                <section className="space-y-4">
                    <h3 className="text-xs font-bold text-[#5d7f89] uppercase tracking-widest px-1">Financial Config</h3>

                    <Card className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-1">
                                <Percent size={14} className="text-primary" />
                                <label className="text-sm font-bold">Service Tax (%)</label>
                            </div>
                            <input
                                type="number"
                                defaultValue={10}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                            <p className="text-[10px] text-[#5d7f89] italic flex items-center gap-1">
                                <Info size={10} /> Applied automatically at checkout
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-1">
                                <Wallet size={14} className="text-primary" />
                                <label className="text-sm font-bold">Reservation Fee (R$)</label>
                            </div>
                            <input
                                type="number"
                                defaultValue={25.00}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                            <p className="text-[10px] text-[#5d7f89] italic">Refundable up to 2 hours before</p>
                        </div>
                    </Card>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xs font-bold text-[#5d7f89] uppercase tracking-widest px-1">Operations</h3>

                    <Card className="p-0 overflow-hidden divide-y divide-gray-50 dark:divide-gray-800">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex gap-3 items-center">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 text-orange-600 rounded-lg">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold">Session Timeout</h4>
                                    <p className="text-[10px] text-[#5d7f89]">Automatic bill closure after inactivity</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-primary">60 min</span>
                        </div>

                        <div className="p-4 flex items-center justify-between">
                            <div className="flex gap-3 items-center">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                                    <Settings2 size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold">Auto-Confirm Orders</h4>
                                    <p className="text-[10px] text-[#5d7f89]">Skip waiter verification for digital orders</p>
                                </div>
                            </div>
                            <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative">
                                <div className="absolute top-1 left-1 size-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </Card>
                </section>

                <button className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-4 active:scale-[0.98]">
                    <Save size={20} />
                    Save Configurations
                </button>
            </div>
        </ManagerLayout>
    );
};
