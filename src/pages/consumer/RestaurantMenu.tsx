import React, { useState } from 'react';
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

const CATEGORIES = ['Appetizers', 'Mains', 'Drinks', 'Desserts'];

const MOCK_MENU = [
    {
        id: '1',
        category: 'Appetizers',
        name: 'Truffle Parmesan Fries',
        price: 14.00,
        description: 'Hand-cut potatoes, truffle oil, aged parmesan, fresh parsley.',
        image: 'https://images.unsplash.com/photo-1630384066202-18d17d120593?q=80&w=1964&auto=format&fit=crop',
        allergens: ['Dairy', 'Gluten']
    },
    {
        id: '2',
        category: 'Appetizers',
        name: 'Artisan Bruschetta',
        price: 12.50,
        description: 'Heirloom tomatoes, balsamic glaze, fresh basil, sourdough.',
        image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?q=80&w=2070&auto=format&fit=crop',
        allergens: ['Vegan']
    },
    {
        id: '3',
        category: 'Mains',
        name: 'Signature Wagyu Burger',
        price: 24.00,
        description: '8oz Wagyu patty, aged cheddar, caramelized onion jam, brioche bun, secret aioli.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop',
        allergens: ['Dairy', 'Meat'],
        isPopular: true,
        calories: 850
    }
];

export const RestaurantMenu: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user, identify, cart, addToCart, setCurrentRestaurant } = useUserStore();
    const [activeCategory, setActiveCategory] = useState('Appetizers');
    const [showIdentityModal, setShowIdentityModal] = useState(false);
    const [guestData, setGuestData] = useState({ name: '', contact: '' });
    const [pendingItem, setPendingItem] = useState<any>(null);

    React.useEffect(() => {
        if (id) {
            setCurrentRestaurant(id);
        }
    }, [id, setCurrentRestaurant]);

    const handleBack = () => {
        setCurrentRestaurant(null);
        navigate('/');
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleAddToCart = (item: any) => {
        if (!user) {
            setPendingItem(item);
            setShowIdentityModal(true);
            return;
        }
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            image: item.image
        });
    };

    const handleGuestIdentify = (e: React.FormEvent) => {
        e.preventDefault();
        identify({
            name: guestData.name,
            phone: guestData.contact,
            isGuest: true
        });
        if (pendingItem) {
            addToCart({
                id: pendingItem.id,
                name: pendingItem.name,
                price: pendingItem.price,
                quantity: 1,
                image: pendingItem.image
            });
            setPendingItem(null);
        }
        setShowIdentityModal(false);
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
                        <h1 id="menu-restaurant-name" className="text-lg font-black leading-tight tracking-tight">The Gourmet Kitchen</h1>
                        <p id="menu-restaurant-stats" className="text-[10px] text-[#e65c00] font-black uppercase tracking-widest flex items-center gap-1">
                            Fine Dining <span className="text-gray-300">•</span> 4.9 <Star size={10} className="fill-current" />
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
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        id={`menu-cat-${cat.toLowerCase()}`}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                            "flex h-9 shrink-0 items-center justify-center px-6 rounded-full text-[10px] font-black uppercase tracking-wider transition-all active:scale-95",
                            activeCategory === cat
                                ? "bg-[#e65c00] text-white shadow-md shadow-[#e65c00]/20"
                                : "bg-gray-50 dark:bg-gray-800 text-[#7A4C30] dark:text-white/40 border border-transparent hover:border-gray-200"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Menu Items */}
            <div id="menu-items-container" className="pb-64 px-4 pt-6">
                <div id="menu-items-header" className="flex items-center justify-between mb-6 px-1">
                    <h2 id="menu-active-category-title" className="text-xl font-black tracking-tight">{activeCategory}</h2>
                    <span id="menu-active-category-subtitle" className="text-[#7A4C30]/40 text-[10px] font-black uppercase tracking-[0.15em]">{activeCategory === 'Mains' ? 'Signature Dishes' : 'Small Plates'}</span>
                </div>

                <div id="menu-items-list" className="space-y-4">
                    {MOCK_MENU.filter(item => item.category === activeCategory).map(item => (
                        item.isPopular ? (
                            /* Large Card for Featured/Popular Mains */
                            <div key={item.id} id={`menu-item-${item.id}`} className="flex flex-col bg-white dark:bg-[#1f1a16] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden group">
                                <div id={`menu-item-img-container-${item.id}`} className="w-full h-44 bg-center bg-cover relative" style={{ backgroundImage: `url(${item.image})` }}>
                                    <div id={`menu-item-price-tag-${item.id}`} className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                                        <p className="text-[#e65c00] font-black text-sm">R$ {item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                                </div>
                                <div id={`menu-item-content-${item.id}`} className="p-5">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <h3 id={`menu-item-name-${item.id}`} className="text-lg font-black text-[#181410] dark:text-white">{item.name}</h3>
                                        <div className="flex gap-0.5 text-[#7A4C30]">
                                            <Star size={14} className="fill-current text-[#e65c00]" />
                                            <Star size={14} className="fill-current text-[#e65c00]" />
                                        </div>
                                    </div>
                                    <p id={`menu-item-desc-${item.id}`} className="text-xs text-gray-500 dark:text-white/50 mb-4 leading-relaxed">{item.description}</p>
                                    <div id={`menu-item-footer-${item.id}`} className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <span className="text-[8px] px-2 py-1 bg-[#7A4C30]/5 text-[#7A4C30] rounded font-black uppercase tracking-wider border border-[#7A4C30]/10">Popular</span>
                                            <span className="text-[8px] px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded font-black uppercase tracking-wider">{item.calories} Cal</span>
                                        </div>
                                        <button
                                            id={`menu-item-add-button-${item.id}`}
                                            onClick={() => handleAddToCart(item)}
                                            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#e65c00] text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#e65c00]/20 active:scale-95 transition-all hover:bg-orange-600"
                                        >
                                            Add to Order
                                            <ShoppingBag size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Regular List Item Card */
                            <div key={item.id} id={`menu-item-${item.id}`} className="bg-white dark:bg-[#1f1a16] rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4 transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-3 duration-500">
                                <div id={`menu-item-img-${item.id}`} className="size-[90px] rounded-xl bg-center bg-cover shrink-0 shadow-inner" style={{ backgroundImage: `url(${item.image})` }}></div>
                                <div id={`menu-item-details-${item.id}`} className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                                    <div>
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 id={`menu-item-name-${item.id}`} className="font-extrabold text-sm leading-tight truncate">{item.name}</h3>
                                            <span id={`menu-item-price-${item.id}`} className="text-[#e65c00] font-black text-sm">R$ {item.price.toFixed(2)}</span>
                                        </div>
                                        <p id={`menu-item-desc-${item.id}`} className="text-[10px] text-gray-400 dark:text-white/40 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                                    </div>
                                    <div id={`menu-item-actions-${item.id}`} className="flex items-center justify-between mt-2">
                                        <div className="flex gap-1.5">
                                            {item.allergens.map(a => (
                                                <span key={a} className="text-[8px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-full border border-gray-100 dark:border-gray-800 text-[#7A4C30]/50 whitespace-nowrap">
                                                    {a}
                                                </span>
                                            ))}
                                        </div>
                                        <button
                                            id={`menu-item-add-button-${item.id}`}
                                            onClick={() => handleAddToCart(item)}
                                            className="size-9 flex items-center justify-center rounded-full bg-[#e65c00] text-white shadow-lg shadow-[#e65c00]/15 active:scale-90 transition-transform"
                                        >
                                            <Plus size={18} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
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
