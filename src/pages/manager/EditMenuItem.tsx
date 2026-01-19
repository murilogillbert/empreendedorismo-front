import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronLeft, Save, Trash2, Beef, Wheat, Milk, Cookie, Egg, Soup, Check, Plus, LayoutGrid, Package } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ManagerLayout } from '@/components/ManagerLayout';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const schema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().min(10, 'Description is too short'),
    price: z.number().min(0.01, 'Price must be greater than zero'),
    category: z.string().min(1, 'Please select a category'),
    available: z.boolean(),
    isCombo: z.boolean(),
    ingredients: z.array(z.string()),
    comboItems: z.array(z.string()),
    allergens: z.array(z.string()),
});

type FormData = z.infer<typeof schema>;

const MOCK_INGREDIENTS = [
    { id: '1', name: 'Extra Cheddar', price: 4.50, allergens: ['lactose'] },
    { id: '2', name: 'Bacon Strips', price: 6.00, allergens: ['meat'] },
    { id: '3', name: 'Egg', price: 3.50, allergens: ['eggs'] },
    { id: '4', name: 'Truffle Mayo', price: 8.50, allergens: ['eggs', 'lactose'] },
];

const MOCK_EXISTING_ITEMS = [
    { id: 'm1', name: 'Classic Burger', price: 28.00, isCombo: false, allergens: ['gluten', 'meat'] },
    { id: 'm2', name: 'French Fries', price: 12.00, isCombo: false, allergens: [] },
    { id: 'm3', name: 'Coca-Cola 350ml', price: 7.00, isCombo: false, allergens: [] },
    { id: 'm4', name: 'Veggie Combo', price: 45.00, isCombo: true, allergens: ['gluten'] },
];

const ALLERGENS = [
    { id: 'gluten', label: 'Gluten', icon: <Wheat size={14} /> },
    { id: 'lactose', label: 'Lactose', icon: <Milk size={14} /> },
    { id: 'nuts', label: 'Nuts', icon: <Cookie size={14} /> },
    { id: 'eggs', label: 'Eggs', icon: <Egg size={14} /> },
    { id: 'seafood', label: 'Seafood', icon: <Soup size={14} /> },
    { id: 'meat', label: 'Meat', icon: <Beef size={14} /> },
];

export const EditMenuItem: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Mock data for initial values
    const mockItem: FormData = {
        name: 'Classic Burger with Cheese',
        description: 'Juicy beef patty with cheddar cheese and special sauce',
        price: 32.90,
        category: 'Burgers',
        available: true,
        isCombo: false,
        ingredients: ['1', '2'],
        comboItems: [],
        allergens: ['gluten', 'meat'],
    };

    const { register, handleSubmit, watch, setValue } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: mockItem
    });

    const isCombo = watch('isCombo');
    const selectedIngredientIds = watch('ingredients');
    const selectedComboItemIds = watch('comboItems');
    const manualAllergens = watch('allergens');

    const derivedAllergens = Array.from(new Set([
        ...selectedIngredientIds.flatMap(id =>
            MOCK_INGREDIENTS.find(ing => ing.id === id)?.allergens || []
        ),
        ...selectedComboItemIds.flatMap(id =>
            MOCK_EXISTING_ITEMS.find(item => item.id === id)?.allergens || []
        )
    ]));

    const totalAllergens = Array.from(new Set([...manualAllergens, ...derivedAllergens]));

    const onSubmit = (data: FormData) => {
        console.log('Updating item:', id, { ...data, allergens: totalAllergens });
        navigate('/menu');
    };

    const handleDelete = () => {
        if (window.confirm('Excluir este item permanentemente?')) {
            console.log('Deleting item:', id);
            navigate('/menu');
        }
    };

    const toggleSelection = (field: 'ingredients' | 'comboItems', id: string) => {
        const current = watch(field);
        if (current.includes(id)) {
            setValue(field, current.filter((i: string) => i !== id));
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
            <header className="pt-2 pb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white dark:bg-[#2d343c] rounded-xl border border-gray-100 dark:border-gray-800 soft-shadow"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight">Edit Item</h1>
                        <p className="text-[#5d7f89] text-xs">Modify composition and combos</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleDelete}
                    className="p-2.5 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/20 active:scale-95 transition-all"
                >
                    <Trash2 size={20} />
                </button>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Status Toggles */}
                <div className="grid grid-cols-2 gap-3">
                    <Card className="flex items-center justify-between p-4 bg-primary/5 border-primary/10">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-1.5 rounded-lg",
                                watch('available') ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                            )}>
                                <div className="size-1.5 rounded-full bg-current" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold">Status</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setValue('available', !watch('available'))}
                            className={cn(
                                "w-10 h-5 rounded-full relative transition-colors",
                                watch('available') ? "bg-primary" : "bg-gray-200"
                            )}
                        >
                            <div className={cn(
                                "absolute top-0.5 size-4 bg-white rounded-full transition-all",
                                watch('available') ? "right-0.5" : "left-0.5"
                            )}></div>
                        </button>
                    </Card>

                    <Card className="flex items-center justify-between p-4 bg-primary/5 border-primary/10">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                <Package size={16} className={cn("transition-transform", isCombo && "rotate-12")} />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold">Is Combo</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setValue('isCombo', !isCombo)}
                            className={cn(
                                "w-10 h-5 rounded-full relative transition-colors",
                                isCombo ? "bg-primary" : "bg-gray-200"
                            )}
                        >
                            <div className={cn(
                                "absolute top-0.5 size-4 bg-white rounded-full transition-all",
                                isCombo ? "right-0.5" : "left-0.5"
                            )}></div>
                        </button>
                    </Card>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#5d7f89] uppercase ml-1">Item Name</label>
                        <input
                            {...register('name')}
                            className="w-full bg-white dark:bg-[#2d343c] border border-gray-100 dark:border-gray-800 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#5d7f89] uppercase ml-1">Price (R$)</label>
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
                                {...register('category')}
                                className="w-full bg-white dark:bg-[#2d343c] border border-gray-100 dark:border-gray-800 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            >
                                <option value="Burgers">Burgers</option>
                                <option value="Combos">Combos</option>
                                <option value="Drinks">Drinks</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Combo Items Selection */}
                {isCombo && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-1.5 px-1">
                            <LayoutGrid size={16} className="text-primary" />
                            <h3 className="text-xs font-bold text-[#5d7f89] uppercase tracking-widest">Included Products</h3>
                        </div>
                        <Card className="p-0 overflow-hidden border-2 border-primary/20">
                            <div className="divide-y divide-gray-50 dark:divide-gray-800 max-h-48 overflow-y-auto scrollbar-hide">
                                {MOCK_EXISTING_ITEMS.map(item => (
                                    <label key={item.id} className="flex items-center gap-3 p-4 active:bg-gray-50 dark:active:bg-[#353c45] cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={selectedComboItemIds.includes(item.id)}
                                            onChange={() => toggleSelection('comboItems', item.id)}
                                            className="hidden"
                                        />
                                        <div className={cn(
                                            "size-5 rounded-full border-2 flex items-center justify-center transition-all",
                                            selectedComboItemIds.includes(item.id) ? "bg-primary border-primary" : "border-gray-200 dark:border-gray-700"
                                        )}>
                                            {selectedComboItemIds.includes(item.id) && <Check size={12} className="text-white" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold">{item.name}</p>
                                        </div>
                                        <p className="text-xs font-bold text-[#5d7f89]">R$ {item.price.toFixed(2)}</p>
                                    </label>
                                ))}
                            </div>
                        </Card>
                    </section>
                )}

                {/* Composition Selection */}
                <section className="space-y-4">
                    <h3 className="text-xs font-bold text-[#5d7f89] uppercase tracking-widest px-1">{isCombo ? 'Extra Options for Combo' : 'Ingredients Composition'}</h3>
                    <Card className="p-0 overflow-hidden">
                        <div className="divide-y divide-gray-50 dark:divide-gray-800 h-48 overflow-y-auto scrollbar-hide">
                            {MOCK_INGREDIENTS.map(ing => (
                                <label key={ing.id} className="flex items-center gap-3 p-4 active:bg-gray-50 dark:active:bg-[#353c45] cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={selectedIngredientIds.includes(ing.id)}
                                        onChange={() => toggleSelection('ingredients', ing.id)}
                                        className="hidden"
                                    />
                                    <div className={cn(
                                        "size-5 rounded border-2 flex items-center justify-center transition-all",
                                        selectedIngredientIds.includes(ing.id) ? "bg-primary border-primary" : "border-gray-200 dark:border-gray-700"
                                    )}>
                                        {selectedIngredientIds.includes(ing.id) && <Check size={12} className="text-white" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold">{ing.name}</p>
                                        <p className="text-[10px] text-[#5d7f89]">Extra: R$ {ing.price.toFixed(2)}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </Card>
                </section>

                {/* Allergens View */}
                <section className="space-y-4">
                    <h3 className="text-xs font-bold text-[#5d7f89] uppercase tracking-widest px-1">Health & Allergens</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {ALLERGENS.map(all => {
                            const autoSelected = derivedAllergens.includes(all.id);
                            const manuallySelected = manualAllergens.includes(all.id);
                            return (
                                <button
                                    key={all.id}
                                    type="button"
                                    disabled={autoSelected}
                                    onClick={() => toggleManualAllergen(all.id)}
                                    className={cn(
                                        "flex items-center gap-1.5 px-2 py-2.5 rounded-xl border text-[10px] font-bold transition-all",
                                        (autoSelected || manuallySelected)
                                            ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 text-orange-600"
                                            : "bg-white dark:bg-[#2d343c] border-gray-100 dark:border-gray-800 text-[#5d7f89]",
                                        autoSelected && "ring-1 ring-orange-200"
                                    )}
                                >
                                    {all.icon}
                                    {all.label}
                                    {autoSelected && <span className="ml-auto text-[8px] opacity-60">(Auto)</span>}
                                </button>
                            );
                        })}
                    </div>
                </section>

                <button
                    type="submit"
                    className="w-full bg-black text-white font-bold py-4 rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                    <Save size={20} />
                    Update Menu Item
                </button>
            </form>
        </ManagerLayout>
    );
};
