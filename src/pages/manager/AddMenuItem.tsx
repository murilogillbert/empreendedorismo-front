import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronLeft, Save, Beef, Wheat, Milk, Cookie, Egg, Soup, Check, LayoutGrid, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ManagerLayout } from '@/components/ManagerLayout';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { managerService } from '@/services/manager.service';
import { restaurantService } from '@/services/restaurant.service';
import { useUserStore } from '@/store/useUserStore';
import type { Ingredient, MenuCategory, MenuItem } from '@/types/api';

const schema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().min(10, 'Description is too short'),
    price: z.number().min(0.01, 'Price must be greater than zero'),
    id_categoria: z.number().min(1, 'Please select a category'),
    ativo: z.boolean(),
    isCombo: z.boolean(),
    ingredients: z.array(z.number()),
    comboItems: z.array(z.number()),
    allergens: z.array(z.string()),
});

type FormData = z.infer<typeof schema>;



const ALLERGENS = [
    { id: 'gluten', label: 'Gluten', icon: <Wheat size={14} /> },
    { id: 'lactose', label: 'Lactose', icon: <Milk size={14} /> },
    { id: 'nuts', label: 'Nuts', icon: <Cookie size={14} /> },
    { id: 'eggs', label: 'Eggs', icon: <Egg size={14} /> },
    { id: 'seafood', label: 'Seafood', icon: <Soup size={14} /> },
    { id: 'meat', label: 'Meat', icon: <Beef size={14} /> },
];

export const AddMenuItem: React.FC = () => {
    const navigate = useNavigate();
    const { managerActiveRestaurantId } = useUserStore();
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [existingItems, setExistingItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            ativo: true,
            isCombo: false,
            ingredients: [],
            comboItems: [],
            allergens: [],
            price: 0,
            description: '',
            name: '',
            id_categoria: 1
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!managerActiveRestaurantId) return;
            try {
                const [ingData, catData, menuData] = await Promise.all([
                    managerService.getIngredients(managerActiveRestaurantId),
                    restaurantService.getCategories(managerActiveRestaurantId),
                    restaurantService.getMenu(managerActiveRestaurantId)
                ]);
                setIngredients(ingData);
                setCategories(catData);
                setExistingItems(menuData);
            } catch (error) {
                console.error("Failed to fetch dependencies:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [managerActiveRestaurantId]);

    const isCombo = watch('isCombo');
    const selectedIngredientIds = watch('ingredients');
    const selectedComboItemIds = watch('comboItems');
    const manualAllergens = watch('allergens');

    const totalAllergens = manualAllergens;

    const onSubmit = async (data: FormData) => {
        if (!managerActiveRestaurantId) return;
        setSubmitting(true);
        try {
            await managerService.createMenuItem(managerActiveRestaurantId, {
                nome: data.name,
                descricao: data.description,
                preco: data.price,
                id_categoria: data.id_categoria,
                ativo: data.ativo,
                ingredientes: data.ingredients,
                alergicos: totalAllergens
            });
            navigate('/manager/menu');
        } catch (error) {
            console.error('Failed to save item:', error);
            alert("Failed to save menu item. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleSelection = (field: 'ingredients' | 'comboItems', id: number) => {
        const current = watch(field);
        if (current.includes(id)) {
            setValue(field, current.filter((i: number) => i !== id));
        } else {
            setValue(field, [...current, id]);
        }
    };

    const toggleManualAllergen = (id: string) => {
        const current = manualAllergens;
        if (current.includes(id)) {
            setValue('allergens', current.filter(a => a !== id));
        } else {
            setValue('allergens', [...current, id]);
        }
    };

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
                    <h1 className="text-xl font-extrabold tracking-tight">Add New Item</h1>
                    <p className="text-[#5d7f89] text-xs">Create a product or specialized combo</p>
                </div>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Toggle Combo */}
                <Card className="flex items-center justify-between p-4 bg-primary/5 border-primary/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Package size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Bundle Items as Combo?</p>
                            <p className="text-[10px] text-[#5d7f89]">Include other products in this price</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setValue('ativo', !watch('ativo'))}
                        className={cn(
                            "w-12 h-6 rounded-full relative transition-colors",
                            watch('ativo') ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                        )}
                    >
                        <div className={cn(
                            "absolute top-1 size-4 bg-white rounded-full transition-all",
                            watch('ativo') ? "right-1" : "left-1"
                        )}></div>
                    </button>
                </Card>

                {/* Basic Info */}
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#5d7f89] uppercase ml-1">Item Name</label>
                        <input
                            {...register('name')}
                            placeholder={isCombo ? "e.g. Master Choice Combo" : "e.g. Classic Burger"}
                            className="w-full bg-white dark:bg-[#2d343c] border border-gray-100 dark:border-gray-800 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                        {errors.name && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#5d7f89] uppercase ml-1">Description</label>
                        <textarea
                            {...register('description')}
                            rows={2}
                            className="w-full bg-white dark:bg-[#2d343c] border border-gray-100 dark:border-gray-800 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#5d7f89] uppercase ml-1">Combo Price (R$)</label>
                            <input
                                {...register('price', { valueAsNumber: true })}
                                type="number"
                                step="0.01"
                                className="w-full bg-white dark:bg-[#2d343c] border border-gray-100 dark:border-gray-800 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#5d7f89] uppercase ml-1">Category</label>
                            <select
                                {...register('id_categoria', { valueAsNumber: true })}
                                className="w-full bg-white dark:bg-[#2d343c] border border-gray-100 dark:border-gray-800 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                            >
                                <option value={0}>Select...</option>
                                {categories.map(cat => (
                                    <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nome}</option>
                                ))}
                            </select>
                            {errors.id_categoria && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.id_categoria.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Combo Items Selection (Only if isCombo is true) */}
                {isCombo && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-1.5 px-1">
                            <LayoutGrid size={16} className="text-primary" />
                            <h3 className="text-xs font-bold text-[#5d7f89] uppercase tracking-widest">Included Products</h3>
                        </div>
                        <Card className="p-0 overflow-hidden border-2 border-primary/20">
                            {loading ? (
                                <div className="p-4 text-center text-xs text-gray-400">Loading items...</div>
                            ) : (
                                <div className="divide-y divide-gray-50 dark:divide-gray-800 max-h-48 overflow-y-auto scrollbar-hide">
                                    {existingItems.map(item => (
                                        <label key={item.id_item} className="flex items-center gap-3 p-4 active:bg-gray-50 dark:active:bg-[#353c45] cursor-pointer transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={selectedComboItemIds.includes(item.id_item)}
                                                onChange={() => toggleSelection('comboItems', item.id_item)}
                                                className="hidden"
                                            />
                                            <div className={cn(
                                                "size-5 rounded-full border-2 flex items-center justify-center transition-all",
                                                selectedComboItemIds.includes(item.id_item) ? "bg-primary border-primary" : "border-gray-200 dark:border-gray-700"
                                            )}>
                                                {selectedComboItemIds.includes(item.id_item) && <Check size={12} className="text-white" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold">{item.nome}</p>
                                            </div>
                                            <p className="text-xs font-bold text-[#5d7f89]">R$ {item.preco.toFixed(2)}</p>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </section>
                )}

                {/* Ingredients Selection */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-xs font-bold text-[#5d7f89] uppercase tracking-widest">{isCombo ? 'Extra Options for Combo' : 'Ingredients Composition'}</h3>
                        <button
                            type="button"
                            onClick={() => navigate('/menu/ingredients')}
                            className="text-[10px] font-bold text-primary hover:underline"
                        >
                            Master Inventory
                        </button>
                    </div>

                    <Card className="p-0 overflow-hidden">
                        {loading ? (
                            <div className="p-4 text-center text-xs text-gray-400">Loading ingredients...</div>
                        ) : (
                            <div className="divide-y divide-gray-50 dark:divide-gray-800 h-48 overflow-y-auto scrollbar-hide">
                                {ingredients.map(ing => (
                                    <label key={ing.id_ingrediente} className="flex items-center gap-3 p-4 active:bg-gray-50 dark:active:bg-[#353c45] cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={selectedIngredientIds.includes(ing.id_ingrediente)}
                                            onChange={() => toggleSelection('ingredients', ing.id_ingrediente)}
                                            className="hidden"
                                        />
                                        <div className={cn(
                                            "size-5 rounded border-2 flex items-center justify-center transition-all",
                                            selectedIngredientIds.includes(ing.id_ingrediente) ? "bg-primary border-primary" : "border-gray-200 dark:border-gray-700"
                                        )}>
                                            {selectedIngredientIds.includes(ing.id_ingrediente) && <Check size={12} className="text-white" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold">{ing.nome}</p>
                                            <p className="text-[10px] text-[#5d7f89]">Extra: R$ {(ing.preco || 0).toFixed(2)}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </Card>
                </section>

                {/* Allergens View */}
                <section className="space-y-4">
                    <div className="flex items-center gap-1.5 px-1">
                        <h3 className="text-xs font-bold text-[#5d7f89] uppercase tracking-widest">Health & Allergens</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {ALLERGENS.map(all => {
                            const manuallySelected = manualAllergens.includes(all.id);
                            return (
                                <button
                                    key={all.id}
                                    type="button"
                                    onClick={() => toggleManualAllergen(all.id)}
                                    className={cn(
                                        "flex items-center gap-1.5 px-2 py-2.5 rounded-xl border text-[10px] font-bold transition-all",
                                        manuallySelected
                                            ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 text-orange-600"
                                            : "bg-white dark:bg-[#2d343c] border-gray-100 dark:border-gray-800 text-[#5d7f89]"
                                    )}
                                >
                                    {all.icon}
                                    {all.label}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Action Button */}
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                >
                    {submitting ? (
                        <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <Save size={20} />
                            {isCombo ? 'Create Combo' : 'Save Menu Item'}
                        </>
                    )}
                </button>
            </form>
        </ManagerLayout>
    );
};
