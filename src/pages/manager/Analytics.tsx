import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ManagerLayout } from '@/components/ManagerLayout';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Filter } from 'lucide-react';

const DATA_BY_RANGE = {
    DAILY: [
        { name: '08:00', total: 400 },
        { name: '10:00', total: 800 },
        { name: '12:00', total: 2400 },
        { name: '14:00', total: 1800 },
        { name: '16:00', total: 900 },
        { name: '18:00', total: 3200 },
        { name: '20:00', total: 4500 },
        { name: '22:00', total: 2100 },
    ],
    WEEKLY: [
        { name: 'Mon', total: 4000 },
        { name: 'Tue', total: 3000 },
        { name: 'Wed', total: 2000 },
        { name: 'Thu', total: 2780 },
        { name: 'Fri', total: 1890 },
        { name: 'Sat', total: 2390 },
        { name: 'Sun', total: 3490 },
    ],
    MONTHLY: [
        { name: 'Week 1', total: 12000 },
        { name: 'Week 2', total: 15000 },
        { name: 'Week 3', total: 11000 },
        { name: 'Week 4', total: 18000 },
    ],
    YEARLY: [
        { name: 'Jan', total: 45000 },
        { name: 'Feb', total: 52000 },
        { name: 'Mar', total: 48000 },
        { name: 'Apr', total: 61000 },
        { name: 'May', total: 55000 },
        { name: 'Jun', total: 67000 },
    ],
};

const TOP_ITEMS_BY_RANGE = {
    DAILY: [
        { name: 'Classic Burger', value: 40 },
        { name: 'Soda', value: 35 },
        { name: 'Fries', value: 25 },
    ],
    WEEKLY: [
        { name: 'Pizza', value: 45 },
        { name: 'Burger', value: 30 },
        { name: 'Pasta', value: 15 },
        { name: 'Salad', value: 10 },
    ],
    MONTHLY: [
        { name: 'Combos', value: 50 },
        { name: 'Burgers', value: 25 },
        { name: 'Drinks', value: 15 },
        { name: 'Sides', value: 10 },
    ],
    YEARLY: [
        { name: 'Main Courses', value: 60 },
        { name: 'Beverages', value: 20 },
        { name: 'Appetizers', value: 15 },
        { name: 'Desserts', value: 5 },
    ],
};

type TimeRange = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export const Analytics: React.FC = () => {
    const [range, setRange] = useState<TimeRange>('WEEKLY');

    return (
        <ManagerLayout>
            <header className="pt-2 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight">Performance Analytics</h1>
                        <p className="text-[#5d7f89] text-sm mt-1">Deep dive into your restaurant's stats</p>
                    </div>

                    {/* Time Range Filter */}
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
                        {(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as TimeRange[]).map((r) => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={cn(
                                    "px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition-all",
                                    range === r
                                        ? "bg-white dark:bg-[#2d343c] text-primary shadow-sm"
                                        : "text-[#5d7f89] hover:text-primary"
                                )}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="space-y-6">
                {/* Insights Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Card className="p-4 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <Clock size={16} className="text-[#5d7f89]" />
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">+12%</span>
                        </div>
                        <p className="text-[10px] font-bold text-[#5d7f89] uppercase tracking-wider mt-1">Avg. Ticket</p>
                        <p className="text-xl font-black">R$ 54.20</p>
                    </Card>
                    <Card className="p-4 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <Calendar size={16} className="text-[#5d7f89]" />
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">-4%</span>
                        </div>
                        <p className="text-[10px] font-bold text-[#5d7f89] uppercase tracking-wider mt-1">Total Orders</p>
                        <p className="text-xl font-black">1.2k</p>
                    </Card>
                    <Card className="p-4 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <Filter size={16} className="text-[#5d7f89]" />
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">+8%</span>
                        </div>
                        <p className="text-[10px] font-bold text-[#5d7f89] uppercase tracking-wider mt-1">Conv. Rate</p>
                        <p className="text-xl font-black">68%</p>
                    </Card>
                    <Card className="p-4 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <TrendingUp size={16} className="text-[#5d7f89]" />
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">+22%</span>
                        </div>
                        <p className="text-[10px] font-bold text-[#5d7f89] uppercase tracking-wider mt-1">Churn Rate</p>
                        <p className="text-xl font-black">2.4%</p>
                    </Card>
                </div>

                <Card title={`${range.charAt(0) + range.slice(1).toLowerCase()} Revenue`}>
                    <div className="h-64 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={DATA_BY_RANGE[range]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#5d7f89', fontWeight: 700 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#5d7f89', fontWeight: 700 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(43, 103, 120, 0.05)' }}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 40px -4px rgba(43, 103, 120, 0.12)',
                                        padding: '12px'
                                    }}
                                    labelStyle={{ fontWeight: 800, marginBottom: '4px', fontSize: '12px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                                />
                                <Bar dataKey="total" fill="#2b6778" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Top Selling Categories">
                    <div className="space-y-4 mt-4">
                        {TOP_ITEMS_BY_RANGE[range].map((item) => (
                            <div key={item.name} className="space-y-1.5">
                                <div className="flex justify-between text-[11px] font-extrabold uppercase tracking-tight">
                                    <span>{item.name}</span>
                                    <span className="text-[#5d7f89]">{item.value}%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-primary h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${item.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </ManagerLayout>
    );
};

const TrendingUp = ({ size, className }: { size: number, className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);
