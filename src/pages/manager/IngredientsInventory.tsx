import React, { useState } from 'react';
import { ChevronLeft, Plus, Trash2, Wheat, Milk, Cookie, Egg, Soup, Beef, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ManagerLayout } from '@/components/ManagerLayout';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface Ingredient {
    id: string;
    name: string;
    price: number;
    allergens: string[];
}

const ALLERGENS = [
    { id: 'gluten', label: 'Gluten', icon: <Wheat size={14} /> },
    { id: 'lactose', label: 'Lactose', icon: <Milk size={14} /> },
    { id: 'nuts', label: 'Nuts', icon: <Cookie size={14} /> },
    { id: 'eggs', label: 'Eggs', icon: <Egg size={14} /> },
    { id: 'seafood', label: 'Seafood', icon: <Soup size={14} /> },
    { id: 'meat', label: 'Meat', icon: <Beef size={14} /> },
];

export const IngredientsInventory: React.FC = () => {
    const navigate = useNavigate();
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { id: '1', name: 'Extra Cheddar', price: 4.50, allergens: ['lactose'] },
        { id: '2', name: 'Bacon Strips', price: 6.00, allergens: ['meat'] },
        { id: '3', name: 'Egg', price: 3.50, allergens: ['eggs'] },
        { id: '4', name: 'Truffle Mayo', price: 8.50, allergens: ['eggs', 'lactose'] },
    ]);

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState<Omit<Ingredient, 'id'>>({
        name: '',
        price: 0,
        allergens: []
    });

    const resetForm = () => {
        setFormData({ name: '', price: 0, allergens: [] });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleSave = () => {
        if (editingId) {
            setIngredients(ingredients.map(ing => ing.id === editingId ? { ...formData, id: editingId } : ing));
        } else {
            setIngredients([...ingredients, { ...formData, id: Math.random().toString() }]);
        }
        resetForm();
    };

    const toggleAllergen = (id: string) => {
        setFormData(prev => ({
            ...prev,
            allergens: prev.allergens.includes(id)
                ? prev.allergens.filter(a => a !== id)
                : [...prev.allergens, id]
        }));
    };

    const deleteIngredient = (id: string) => {
        if (window.confirm('Excluir este ingrediente?')) {
            setIngredients(ingredients.filter(ing => ing.id !== id));
        }
    };

    return (
        <ManagerLayout>
            <header className="pt-2 pb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white dark:bg-[#2d343c] rounded-xl border border-gray-100 dark:border-gray-800 soft-shadow"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight">Ingredient Inventory</h1>
                        <p className="text-[#5d7f89] text-xs">Manage extras and base ingredients</p>
                    </div>
                </div>
                {!isAdding && !editingId && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-primary text-white p-2.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                    >
                        <Plus size={20} />
                    </button>
                )}
            </header>

            <div className="space-y-6">
                {/* Add/Edit Form */}
                {(isAdding || editingId) && (
                    <Card className="space-y-4 border-2 border-primary/20 bg-primary/5">
                        <h3 className="font-extrabold text-sm">{editingId ? 'Edit Ingredient' : 'New Ingredient'}</h3>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#5d7f89] uppercase ml-1">Name</label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white dark:bg-[#2d343c] border border-gray-100 dark:border-gray-800 rounded-lg py-2 px-3 text-sm outline-none"
                                    placeholder="e.g. Gorgonzola Cheese"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#5d7f89] uppercase ml-1">Price (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-white dark:bg-[#2d343c] border border-gray-100 dark:border-gray-800 rounded-lg py-2 px-3 text-sm outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#5d7f89] uppercase ml-1">Allergens</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {ALLERGENS.map(all => (
                                        <button
                                            key={all.id}
                                            type="button"
                                            onClick={() => toggleAllergen(all.id)}
                                            className={cn(
                                                "flex items-center gap-1 px-2 py-1.5 rounded-md border text-[9px] font-bold transition-all",
                                                formData.allergens.includes(all.id)
                                                    ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 text-orange-600"
                                                    : "bg-white dark:bg-gray-800 border-gray-100 text-[#5d7f89]"
                                            )}
                                        >
                                            {all.icon} {all.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button onClick={resetForm} className="flex-1 py-2 text-xs font-bold text-[#5d7f89] bg-gray-100 dark:bg-gray-800 rounded-lg">Cancel</button>
                            <button onClick={handleSave} className="flex-1 py-2 text-xs font-bold text-white bg-primary rounded-lg">Save</button>
                        </div>
                    </Card>
                )}

                {/* Search */}
                {!isAdding && !editingId && (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5d7f89]" size={16} />
                        <input
                            placeholder="Filter ingredients..."
                            className="w-full bg-white dark:bg-[#2d343c] border border-gray-100 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>
                )}

                {/* List */}
                <div className="space-y-3">
                    {ingredients.map(ing => (
                        <Card key={ing.id} className="p-4 flex items-center justify-between">
                            <div className="flex-1">
                                <h4 className="font-bold text-sm tracking-tight">{ing.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-primary font-bold text-xs">R$ {ing.price.toFixed(2)}</span>
                                    {ing.allergens.length > 0 && (
                                        <div className="flex gap-1 ml-2">
                                            {ing.allergens.map(aId => {
                                                const all = ALLERGENS.find(a => a.id === aId);
                                                return <span key={aId} className="text-orange-500 bg-orange-50 dark:bg-orange-900/10 p-1 rounded-md">{all?.icon}</span>
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => {
                                        setFormData({ name: ing.name, price: ing.price, allergens: ing.allergens });
                                        setEditingId(ing.id);
                                    }}
                                    className="p-2 text-[#5d7f89] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteIngredient(ing.id)}
                                    className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </ManagerLayout>
    );
};
