import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, UtensilsCrossed, ReceiptText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ManagerLayout } from '@/components/ManagerLayout';
import { Card } from '@/components/ui/Card';
import { managerService } from '@/services/manager.service';
import { useUserStore } from '@/store/useUserStore';
import type { Restaurant } from '@/types/api';

export const Dashboard: React.FC = () => {
    const { managerActiveRestaurantId, setManagerActiveRestaurant } = useUserStore();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [stats, setStats] = useState<{ revenue: number, guests: number, orders: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const data = await managerService.getRestaurants();
                setRestaurants(data);
                if (data.length > 0 && !managerActiveRestaurantId) {
                    setManagerActiveRestaurant(data[0].id_restaurante);
                }
            } catch (error) {
                console.error("Failed to fetch manager restaurants:", error);
            }
        };
        fetchRestaurants();
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            if (!managerActiveRestaurantId) return;
            setLoading(true);
            try {
                const data = await managerService.getDailyAnalytics(managerActiveRestaurantId);
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [managerActiveRestaurantId]);

    const activeRestaurant = restaurants.find(r => r.id_restaurante === managerActiveRestaurantId);

    return (
        <ManagerLayout>
            <header className="pt-2 pb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight">Manager Dashboard</h1>
                        {restaurants.length > 1 ? (
                            <select
                                value={managerActiveRestaurantId || ''}
                                onChange={(e) => setManagerActiveRestaurant(Number(e.target.value))}
                                className="mt-1 bg-transparent text-primary text-xs font-bold border-none p-0 focus:ring-0 cursor-pointer"
                            >
                                {restaurants.map(r => (
                                    <option key={r.id_restaurante} value={r.id_restaurante}>{r.nome_fantasia}</option>
                                ))}
                            </select>
                        ) : (
                            <p className="text-[#5d7f89] text-sm mt-1">{activeRestaurant?.nome_fantasia || 'Select a restaurant'}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-full">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse-live"></span>
                        <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">Live</span>
                    </div>
                </div>
                <p className="text-[#5d7f89] text-[10px] uppercase font-bold tracking-widest mt-2">Real-time status as of {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </header>

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bento-grid">
                    {/* Revenue Card */}
                    <Card title="Gross Revenue" subtitle={`R$ ${stats?.revenue.toFixed(2) || '0.00'}`} className="col-span-2 relative overflow-hidden">
                        <div className="absolute top-5 right-5 flex items-center gap-1 text-green-600 dark:text-green-400 font-bold text-sm bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg">
                            <TrendingUp size={14} />
                            Today
                        </div>
                        <div className="h-16 w-full mt-2">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100">
                                <path d="M0,80 Q50,75 80,40 T160,50 T240,20 T320,60 T400,10" fill="none" stroke="#2b6778" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                        </div>
                    </Card>

                    {/* Guests Card */}
                    <Card className="flex flex-col gap-1">
                        <Users className="text-primary bg-primary/10 w-fit p-1.5 rounded-lg mb-2" size={32} />
                        <p className="text-[#5d7f89] text-xs font-bold uppercase tracking-wider">Guests</p>
                        <p className="text-2xl font-extrabold">{stats?.guests || 0}</p>
                        <p className="text-gray-400 text-[11px] font-bold">In session</p>
                    </Card>

                    {/* Occupancy Card */}
                    <Card className="flex flex-col gap-1">
                        <UtensilsCrossed className="text-primary bg-primary/10 w-fit p-1.5 rounded-lg mb-2" size={32} />
                        <p className="text-[#5d7f89] text-xs font-bold uppercase tracking-wider">Occupancy</p>
                        <p className="text-2xl font-extrabold">60%</p>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="bg-primary h-full w-[60%] rounded-full"></div>
                        </div>
                    </Card>

                    {/* Orders Card */}
                    <Link to="/kitchen-production" className="col-span-2 group">
                        <Card className="flex items-center justify-between p-4 group-hover:border-primary/50 transition-all active:scale-[0.98]">
                            <div className="flex items-center gap-4">
                                <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl group-hover:scale-110 transition-transform">
                                    <ReceiptText className="text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Active Orders</p>
                                    <p className="text-[#5d7f89] text-xs">{stats?.orders || 0} currently in kitchen</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-extrabold text-primary">{stats?.orders || 0}</p>
                            </div>
                        </Card>
                    </Link>
                </div>
            )}

            {/* Action Panel */}
            <div className="mt-6">
                <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 flex flex-col gap-4 items-center justify-between">
                    <div className="text-center sm:text-left">
                        <p className="font-bold text-sm">Performance Insights</p>
                        <p className="text-xs text-[#5d7f89] mt-0.5">Deep dive into today's staff efficiency</p>
                    </div>
                    <Link to="/analytics" className="w-full sm:w-auto">
                        <button className="w-full bg-primary text-white text-sm font-bold py-2.5 px-6 rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
                            Detailed Analytics
                        </button>
                    </Link>
                </div>
            </div>
        </ManagerLayout>
    );
};
