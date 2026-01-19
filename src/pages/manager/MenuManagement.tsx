import React, { useState } from 'react';
import { Plus, Search, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ManagerLayout } from '@/components/ManagerLayout';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    available: boolean;
}

const MOCK_ITEMS: MenuItem[] = [
    { id: 1, name: 'Pizza Margherita', description: 'Classic tomato and mozzarella', price: 45.90, category: 'Pizzas', available: true },
    { id: 2, name: 'Burger Deluxe', description: 'Beef patty with cheddar and bacon', price: 38.50, category: 'Burgers', available: true },
    { id: 3, name: 'Caesar Salad', description: 'Romaine lettuce with dressing', price: 29.00, category: 'Salads', available: false },
    { id: 4, name: 'Pasta Carbonara', description: 'Creamy pasta with pancetta', price: 42.00, category: 'Pasta', available: true },
];

export const MenuManagement: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...new Set(MOCK_ITEMS.map(item => item.category))];

    const filteredItems = MOCK_ITEMS.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <ManagerLayout>
            <header className="pt-2 pb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-extrabold tracking-tight">Menu Management</h1>
                    <Link to="/menu/add">
                        <button className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
                            <Plus size={24} />
                        </button>
                    </Link>
                </div>
                <p className="text-[#5d7f89] text-sm mt-1">Manage your restaurant's offerings</p>
                <div className="mt-4 flex gap-4">
                    <Link to="/menu/categories" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                        Manage Categories <MoreVertical size={14} className="rotate-90" />
                    </Link>
                    <Link to="/menu/ingredients" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                        Ingredients Inventory <Plus size={14} />
                    </Link>
                </div>
            </header>

            {/* Search and Filters */}
            <div className="space-y-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5d7f89]" size={18} />
                    <input
                        type="text"
                        placeholder="Search items..."
                        className="w-full bg-white dark:bg-[#2d343c] border border-gray-100 dark:border-gray-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                                selectedCategory === cat
                                    ? "bg-primary text-white"
                                    : "bg-white dark:bg-[#2d343c] text-[#5d7f89] border border-gray-100 dark:border-gray-800"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
                {filteredItems.map(item => (
                    <Card key={item.id} className="p-0 overflow-hidden">
                        <Link to={`/menu/edit/${item.id}`} className="p-4 flex justify-between items-start active:bg-gray-50 dark:active:bg-[#353c45] transition-colors">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-sm tracking-tight">{item.name}</h3>
                                    {!item.available && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full border border-red-100 dark:border-red-800 uppercase tracking-wider">
                                            Out of Stock
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] text-[#5d7f89] line-clamp-1 mt-0.5">{item.description}</p>
                                <p className="text-primary font-extrabold mt-2 text-sm">R$ {item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="text-[#5d7f89] p-1">
                                    <MoreVertical size={18} />
                                </div>
                            </div>
                        </Link>
                    </Card>
                ))}
            </div>
        </ManagerLayout>
    );
};
