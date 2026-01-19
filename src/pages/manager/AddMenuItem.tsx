import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronLeft, Save, Plus, Info, Beef, Wheat, Milk, Cookie, Egg, Soup, Check, LayoutGrid, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
    ingredients: z.array(z.string()), // IDs of selected ingredients
    comboItems: z.array(z.string()), // IDs of existing menu items
    allergens: z.array(z.string()),
});

type FormData = z.infer<typeof schema>;

// Mock data for ingredients
const MOCK_INGREDIENTS = [
    { id: '1', name: 'Extra Cheddar', price: 4.50, allergens: ['lactose'] },
    { id: '2', name: 'Bacon Strips', price: 6.00, allergens: ['meat'] },
    { id: '3', name: 'Egg', price: 3.50, allergens: ['eggs'] },
    { id: '4', name: 'Truffle Mayo', price: 8.50, allergens: ['eggs', 'lactose'] },
];

// Mock data for existing menu items (to be used in combos)
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

export const AddMenuItem: React.FC = () => {
    const navigate = useNavigate();

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            available: true,
            isCombo: false,
            ingredients: [],
            comboItems: [],
            allergens: [],
            price: 0,
            description: '',
            name: '',
            category: ''
        }
    });

    const isCombo = watch('isCombo');
    const selectedIngredientIds = watch('ingredients');
    const selectedComboItemIds = watch('comboItems');
    const manualAllergens = watch('allergens');

    // Derive allergens from selected ingredients AND selected combo items
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
        console.log('Saving item:', { ...data, allergens: totalAllergens });
        navigate('/menu');
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
                        onClick={() => setValue('isCombo', !isCombo)}
                        className={cn(
                            "w-12 h-6 rounded-full relative transition-colors",
                            isCombo ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                        )}
                    >
                        <div className={cn(
                            "absolute top-1 size-4 bg-white rounded-full transition-all",
                            isCombo ? "right-1" : "left-1"
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
                                {...register('category')}
                                className="w-full bg-white dark:bg-[#2d343c] border border-gray-100 dark:border-gray-800 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                            >
                                <option value="">Select...</option>
                                <option value="Burgers">Burgers</option>
                                <option value="Combos">Combos</option>
                                <option value="Drinks">Drinks</option>
                            </select>
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
                                            {item.isCombo && <span className="text-[8px] px-1 bg-teal-50 text-teal-600 rounded uppercase font-bold">Recursive Combo</span>}
                                        </div>
                                        <p className="text-xs font-bold text-[#5d7f89]">R$ {item.price.toFixed(2)}</p>
                                    </label>
                                ))}
                            </div>
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
                    <div className="flex items-center gap-1.5 px-1">
                        <h3 className="text-xs font-bold text-[#5d7f89] uppercase tracking-widest">Health & Allergens</h3>
                    </div>

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

                {/* Action Button */}
                <button
                    type="submit"
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                    <Save size={20} />
                    {isCombo ? 'Create Combo' : 'Save Menu Item'}
                </button>
            </form>
        </ManagerLayout>
    );
};
