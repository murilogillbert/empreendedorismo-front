import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ManagerLayout } from '@/components/ManagerLayout';
import { Card } from '@/components/ui/Card';

const REVENUE_DATA = [
    { name: 'Mon', total: 4000 },
    { name: 'Tue', total: 3000 },
    { name: 'Wed', total: 2000 },
    { name: 'Thu', total: 2780 },
    { name: 'Fri', total: 1890 },
    { name: 'Sat', total: 2390 },
    { name: 'Sun', total: 3490 },
];

const TOP_ITEMS = [
    { name: 'Pizza', value: 45 },
    { name: 'Burger', value: 30 },
    { name: 'Pasta', value: 15 },
    { name: 'Salad', value: 10 },
];

export const Analytics: React.FC = () => {
    return (
        <ManagerLayout>
            <header className="pt-2 pb-6">
                <h1 className="text-2xl font-extrabold tracking-tight">Performance Analytics</h1>
                <p className="text-[#5d7f89] text-sm mt-1">Deep dive into your restaurant's stats</p>
            </header>

            <div className="space-y-6">
                <Card title="Weekly Revenue">
                    <div className="h-64 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={REVENUE_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5d7f89' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5d7f89' }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(43, 103, 120, 0.05)' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(43, 103, 120, 0.08)' }}
                                />
                                <Bar dataKey="total" fill="#2b6778" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Top Selling Categories">
                    <div className="space-y-4 mt-4">
                        {TOP_ITEMS.map((item) => (
                            <div key={item.name} className="space-y-1">
                                <div className="flex justify-between text-xs font-bold">
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
