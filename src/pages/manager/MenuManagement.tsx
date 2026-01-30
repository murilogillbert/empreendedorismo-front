import React, { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ManagerLayout } from '@/components/ManagerLayout';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { restaurantService } from '@/services/restaurant.service';
import { useUserStore } from '@/store/useUserStore';
import type { MenuItem } from '@/types/api';



export const MenuManagement: React.FC = () => {
    const { managerActiveRestaurantId } = useUserStore();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'All'>('All');
    const [categories, setCategories] = useState<{ id_categoria: number, nome: string }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!managerActiveRestaurantId) return;
            setLoading(true);
            try {
                const [menuData, categoriesData] = await Promise.all([
                    restaurantService.getMenu(managerActiveRestaurantId),
                    restaurantService.getCategories(managerActiveRestaurantId)
                ]);
                setMenuItems(menuData);
                setCategories(categoriesData);
            } catch (error) {
                console.error("Failed to fetch menu data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [managerActiveRestaurantId]);

    const filteredItems = menuItems.filter(item => {
        const matchesSearch = item.nome.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategoryId === 'All' || item.id_categoria === selectedCategoryId;
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
                    <button
                        onClick={() => setSelectedCategoryId('All')}
                        className={cn(
                            "px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                            selectedCategoryId === 'All'
                                ? "bg-primary text-white"
                                : "bg-white dark:bg-[#2d343c] text-[#5d7f89] border border-gray-100 dark:border-gray-800"
                        )}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id_categoria}
                            onClick={() => setSelectedCategoryId(cat.id_categoria)}
                            className={cn(
                                "px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                                selectedCategoryId === cat.id_categoria
                                    ? "bg-primary text-white"
                                    : "bg-white dark:bg-[#2d343c] text-[#5d7f89] border border-gray-100 dark:border-gray-800"
                            )}
                        >
                            {cat.nome}
                        </button>
                    ))}
                </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 font-bold text-sm">No items found.</div>
                ) : (
                    filteredItems.map(item => (
                        <Card key={item.id_item} className="p-0 overflow-hidden">
                            <Link to={`/manager/menu/edit/${item.id_item}`} className="p-4 flex justify-between items-start active:bg-gray-50 dark:active:bg-[#353c45] transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-sm tracking-tight">{item.nome}</h3>
                                        {!item.ativo && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full border border-red-100 dark:border-red-800 uppercase tracking-wider">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-[#5d7f89] line-clamp-1 mt-0.5">{item.descricao}</p>
                                    <p className="text-primary font-extrabold mt-2 text-sm">R$ {item.preco.toFixed(2)}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="text-[#5d7f89] p-1">
                                        <MoreVertical size={18} />
                                    </div>
                                </div>
                            </Link>
                        </Card>
                    ))
                )}
            </div>
        </ManagerLayout>
    );
};
