import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Info,
    Star,
    CalendarDays,
    Plus,
    ShoppingBasket,
    ChevronRight,
    Search,
    ShoppingBag
} from 'lucide-react';
import { ConsumerLayout } from '@/components/ConsumerLayout';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';
import { restaurantService } from '@/services/restaurant.service';
import type { Restaurant, MenuItem, MenuCategory } from '@/types/api';

export const RestaurantMenu: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user, anonymousLogin, cart, addToCart, setCurrentRestaurant } = useUserStore();

    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const [showIdentityModal, setShowIdentityModal] = useState(false);
    const [guestData, setGuestData] = useState({ name: '', contact: '' });
    const [pendingItem, setPendingItem] = useState<MenuItem | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const [resInfo, cats] = await Promise.all([
                    restaurantService.getById(id),
                    restaurantService.getCategories(id)
                ]);
                setRestaurant(resInfo);
                setMenu(resInfo.menu || []);
                setCategories(cats);
                if (cats.length > 0) setActiveCategoryId(cats[0].id_categoria);
            } catch (error) {
                console.error("Failed to fetch menu data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        setCurrentRestaurant(id || null);
    }, [id, setCurrentRestaurant]);

    const handleBack = () => {
        setCurrentRestaurant(null);
        navigate('/');
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleAddToCart = (item: MenuItem) => {
        if (!user) {
            setPendingItem(item);
            setShowIdentityModal(true);
            return;
        }
        addToCart({
            id: String(item.id_item),
            name: item.nome,
            price: item.preco,
            quantity: 1,
            image: item.image
        });
    };

    const handleGuestIdentify = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await anonymousLogin();
            if (pendingItem) {
                addToCart({
                    id: String(pendingItem.id_item),
                    name: pendingItem.nome,
                    price: pendingItem.preco,
                    quantity: 1,
                    image: pendingItem.image
                });
                setPendingItem(null);
            }
            setShowIdentityModal(false);
        } catch (error) {
            console.error("Anonymous login failed:", error);
        }
    };

    return (
        <ConsumerLayout>
            {/* Header */}
            <div id="menu-header" className="flex items-center bg-white dark:bg-[#1f1a16] px-4 py-4 justify-between border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40">
                <div id="menu-header-info" className="flex items-center gap-3">
                    <button id="menu-back-button" onClick={handleBack} className="size-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 transition-colors hover:bg-gray-100">
                        <ArrowLeft size={18} />
                    </button>
                    <div id="menu-restaurant-details">
                        <h1 id="menu-restaurant-name" className="text-lg font-black leading-tight tracking-tight">{restaurant?.nome_fantasia || 'Loading...'}</h1>
                        <p id="menu-restaurant-stats" className="text-[10px] text-[#e65c00] font-black uppercase tracking-widest flex items-center gap-1">
                            {restaurant?.categoria_principal} <span className="text-gray-300">•</span> 4.9 <Star size={10} className="fill-current" />
                        </p>
                    </div>
                </div>
                <div id="menu-header-actions" className="flex items-center gap-2">
                    <button
                        id="menu-book-button"
                        onClick={() => navigate(`/reservations/${id}`)}
                        className="bg-[#7A4C30] text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 uppercase tracking-widest active:scale-95 transition-all hover:bg-[#5a3824]"
                    >
                        <CalendarDays size={14} />
                        Book
                    </button>
                    <button id="menu-info-button" className="size-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
                        <Info size={18} className="text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Banner */}
            <div id="menu-banner-container" className="p-4">
                <div id="menu-banner" className="w-full h-44 bg-center bg-cover flex flex-col justify-end overflow-hidden rounded-2xl shadow-xl relative group" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop")' }}>
                    <div id="menu-banner-overlay" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div id="menu-banner-content" className="relative p-5">
                        <span id="menu-banner-tag" className="bg-[#e65c00] text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-[0.2em] shadow-lg">Seasonal Menu</span>
                        <p id="menu-banner-text" className="text-white text-base mt-1 font-bold opacity-90">Experience the craft of artisanal cuisine.</p>
                    </div>
                </div>
            </div>

            {/* Category Navigation */}
            <div id="menu-category-nav" className="sticky top-[73px] z-30 bg-white/80 dark:bg-[#181410]/80 backdrop-blur-md py-3 px-4 flex gap-3 overflow-x-auto no-scrollbar border-b border-gray-100 dark:border-gray-800">
                {categories.map(cat => (
                    <button
                        key={cat.id_categoria}
                        id={`menu-cat-${cat.id_categoria}`}
                        onClick={() => setActiveCategoryId(cat.id_categoria)}
                        className={cn(
                            "flex h-9 shrink-0 items-center justify-center px-6 rounded-full text-[10px] font-black uppercase tracking-wider transition-all active:scale-95",
                            activeCategoryId === cat.id_categoria
                                ? "bg-[#e65c00] text-white shadow-md shadow-[#e65c00]/20"
                                : "bg-gray-50 dark:bg-gray-800 text-[#7A4C30] dark:text-white/40 border border-transparent hover:border-gray-200"
                        )}
                    >
                        {cat.nome}
                    </button>
                ))}
            </div>

            {/* Menu Items */}
            <div id="menu-items-container" className="pb-64 px-4 pt-6">
                <div id="menu-items-header" className="flex items-center justify-between mb-6 px-1">
                    <h2 id="menu-active-category-title" className="text-xl font-black tracking-tight">
                        {categories.find(c => c.id_categoria === activeCategoryId)?.nome || 'Menu'}
                    </h2>
                </div>

                <div id="menu-items-list" className="space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="size-12 border-4 border-[#e65c00] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading our finest dishes...</p>
                        </div>
                    ) : (menu.filter(item => item.id_categoria === activeCategoryId).length === 0 ? (
                        <div className="text-center py-12 text-gray-400 font-bold text-sm">No items in this category.</div>
                    ) : (
                        menu.filter(item => item.id_categoria === activeCategoryId).map(item => (
                            <div key={item.id_item} id={`menu-item-${item.id_item}`} className="bg-white dark:bg-[#1f1a16] rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4 transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-3 duration-500">
                                <div id={`menu-item-img-${item.id_item}`} className="size-[90px] rounded-xl bg-center bg-cover shrink-0 shadow-inner" style={{ backgroundImage: `url(${item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop'})` }}></div>
                                <div id={`menu-item-details-${item.id_item}`} className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                                    <div>
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 id={`menu-item-name-${item.id_item}`} className="font-extrabold text-sm leading-tight truncate">{item.nome}</h3>
                                            <span id={`menu-item-price-${item.id_item}`} className="text-[#e65c00] font-black text-sm">R$ {item.preco.toFixed(2)}</span>
                                        </div>
                                        <p id={`menu-item-desc-${item.id_item}`} className="text-[10px] text-gray-400 dark:text-white/40 mt-1 line-clamp-2 leading-relaxed">{item.descricao}</p>
                                    </div>
                                    <div id={`menu-item-actions-${item.id_item}`} className="flex items-center justify-between mt-2">
                                        <div className="flex gap-1.5">
                                            <span className="text-[8px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-full border border-gray-100 dark:border-gray-800 text-[#7A4C30]/50 whitespace-nowrap">
                                                Handcrafted
                                            </span>
                                        </div>
                                        <button
                                            id={`menu-item-add-button-${item.id_item}`}
                                            onClick={() => handleAddToCart(item)}
                                            className="size-9 flex items-center justify-center rounded-full bg-[#e65c00] text-white shadow-lg shadow-[#e65c00]/15 active:scale-90 transition-transform"
                                        >
                                            <Plus size={18} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ))}
                </div>
            </div>

            {/* Cart Section */}
            {cartCount > 0 && (
                <div id="menu-cart-bar" className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 duration-700">
                    <div id="menu-cart-container" className="bg-[#181410] dark:bg-zinc-800 text-white rounded-[2rem] p-4 flex items-center justify-between shadow-2xl border border-white/5 ring-4 ring-black/5">
                        <div id="menu-cart-info" className="flex items-center gap-3 ml-1">
                            <div id="menu-cart-icon-container" className="relative size-11 bg-[#e65c00] rounded-2xl flex items-center justify-center shadow-lg shadow-[#e65c00]/20">
                                <ShoppingBasket size={22} strokeWidth={2.5} />
                                <div id="menu-cart-badge" className="absolute -top-2 -right-2 size-6 bg-white text-[#e65c00] text-[11px] font-black rounded-full flex items-center justify-center shadow-xl border-2 border-[#181410]">
                                    {cartCount}
                                </div>
                            </div>
                            <div id="menu-cart-total-info">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">Cart Summary</p>
                                <p className="text-base font-black">R$ {cartTotal.toFixed(2)} <span className="text-[10px] font-normal opacity-40 ml-1">+ taxes</span></p>
                            </div>
                        </div>
                        <button
                            id="menu-view-cart-button"
                            onClick={() => navigate('/cart')}
                            className="bg-[#e65c00] hover:bg-orange-600 transition-all px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-[#e65c00]/20 active:scale-95"
                        >
                            View Cart
                            <ChevronRight size={16} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            )}

            {/* Identity Modal (Guest Flow) */}
            {showIdentityModal && (
                <div id="menu-identity-modal-overlay" className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-4 px-6 animate-in fade-in duration-300">
                    <div id="menu-identity-modal" className="w-full max-w-sm bg-white dark:bg-[#1f1a16] rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500 border border-gray-100 dark:border-gray-800">
                        <div id="menu-identity-modal-header" className="text-center space-y-2 mb-8">
                            <div className="size-16 bg-[#e65c00]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#e65c00]">
                                <Search size={28} />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight text-[#181410] dark:text-white">Identify Yourself</h3>
                            <p className="text-[#7A4C30]/50 text-xs font-semibold leading-relaxed">Please provide a name and contact for your order</p>
                        </div>

                        <form id="menu-identity-form" onSubmit={handleGuestIdentify} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#7A4C30] uppercase tracking-widest ml-2">Name</label>
                                <input
                                    id="menu-guest-name"
                                    required
                                    type="text"
                                    placeholder="Michael Scott"
                                    value={guestData.name}
                                    onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4.5 px-6 text-sm font-bold focus:ring-2 focus:ring-[#e65c00]/20 outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#7A4C30] uppercase tracking-widest ml-2">Email or Cellphone</label>
                                <input
                                    id="menu-guest-contact"
                                    required
                                    type="text"
                                    placeholder="(11) 99999-0000"
                                    value={guestData.contact}
                                    onChange={(e) => setGuestData({ ...guestData, contact: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4.5 px-6 text-sm font-bold focus:ring-2 focus:ring-[#e65c00]/20 outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>
                            <button id="menu-guest-submit" className="w-full bg-[#e65c00] text-white font-black py-4.5 rounded-2xl shadow-2xl shadow-[#e65c00]/30 mt-6 active:scale-95 transition-all hover:bg-orange-600 uppercase tracking-[0.2em] text-[10px]">
                                Add to Order
                            </button>
                            <button
                                id="menu-login-link"
                                type="button"
                                onClick={() => navigate('/auth')}
                                className="w-full text-[10px] font-black text-[#7A4C30] hover:text-[#e65c00] uppercase tracking-widest pt-4 transition-colors"
                            >
                                Use registered profile
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </ConsumerLayout>
    );
};
