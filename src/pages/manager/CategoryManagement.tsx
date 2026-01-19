import React from 'react';
import { ChevronLeft, Plus, MoreVertical, GripVertical, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ManagerLayout } from '@/components/ManagerLayout';
import { Card } from '@/components/ui/Card';

export const CategoryManagement: React.FC = () => {
    const navigate = useNavigate();
    const categories = ['Burgers', 'Pizzas', 'Salads', 'Drinks', 'Desserts', 'Sides'];

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
                    <h1 className="text-xl font-extrabold tracking-tight">Menu Categories</h1>
                    <p className="text-[#5d7f89] text-xs">Organize your menu structure</p>
                </div>
            </header>

            <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <input
                        placeholder="New category name..."
                        className="flex-1 bg-white dark:bg-[#2d343c] border border-gray-100 dark:border-gray-800 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                    <button className="bg-primary text-white p-3 rounded-xl shadow-lg shadow-primary/20">
                        <Plus size={20} />
                    </button>
                </div>

                <div className="space-y-2 mt-4">
                    {categories.map((cat, index) => (
                        <Card key={cat} className="p-3 flex items-center gap-3">
                            <GripVertical size={18} className="text-gray-300" />
                            <span className="text-xs font-bold text-gray-400 mr-2">#{index + 1}</span>
                            <span className="flex-1 font-bold text-sm">{cat}</span>
                            <button className="text-[#5d7f89] p-1">
                                <MoreVertical size={18} />
                            </button>
                        </Card>
                    ))}
                </div>

                <button className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-4 active:scale-[0.98]">
                    <Save size={20} />
                    Save Sort Order
                </button>
            </div>
        </ManagerLayout>
    );
};
