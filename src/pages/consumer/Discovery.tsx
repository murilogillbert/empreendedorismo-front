import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Pizza, Fish, Coffee, Croissant, Star, ArrowRight, Heart } from 'lucide-react';
import { ConsumerLayout } from '@/components/ConsumerLayout';
import { RestaurantMap } from '@/components/RestaurantMap';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';

const CATEGORIES = [
    { id: 'italian', label: 'Italian', icon: <Pizza size={18} /> },
    { id: 'sushi', label: 'Sushi', icon: <Fish size={18} /> },
    { id: 'bakery', label: 'Bakery', icon: <Croissant size={18} /> },
    { id: 'coffee', label: 'Coffee', icon: <Coffee size={18} /> },
];

const MOCK_RESTAURANTS = [
    { id: 1, name: 'The Artisan Hearth', lat: -23.5505, lng: -46.6333, category: 'Italian' },
    { id: 2, name: 'Suki Sushi', lat: -23.5515, lng: -46.6343, category: 'Sushi' },
    { id: 3, name: 'Cafe Noir', lat: -23.5495, lng: -46.6323, category: 'Coffee' },
];

export const Discovery: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('italian');

    return (
        <ConsumerLayout>
            {/* Header Area */}
            <div id="discovery-header-area" className="absolute top-0 z-20 w-full px-4 pt-6 pb-2 pointer-events-none">
                <div id="discovery-controls" className="flex flex-col gap-3 pointer-events-auto">

                    {/* Search Bar */}
                    <div id="discovery-search-wrapper" className="flex items-center gap-2">
                        <div id="discovery-search-input-container" className="flex flex-1 items-center gap-3 h-12 rounded-xl bg-white dark:bg-[#1f1a16] shadow-lg border border-gray-100 dark:border-gray-800 px-4">
                            <Search size={18} className="text-[#7A4C30]" />
                            <input
                                id="discovery-search-input"
                                className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-gray-400"
                                placeholder="Search for 'Pizza' or 'Sushi'..."
                                type="text"
                            />
                        </div>
                        <button id="discovery-filter-button" className="flex size-12 items-center justify-center rounded-xl bg-white dark:bg-[#1f1a16] shadow-lg border border-gray-100 dark:border-gray-800 text-[#7A4C30] active:scale-95 transition-transform mr-[35px]">
                            <SlidersHorizontal size={20} />
                        </button>
                    </div>

                    {/* Categories */}
                    <div id="discovery-categories-scroll" className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={cn(
                                    "flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 text-xs font-bold shadow-sm transition-all active:scale-95",
                                    selectedCategory === cat.id
                                        ? "bg-[#e65c00] text-white shadow-md shadow-[#e65c00]/20"
                                        : "bg-white dark:bg-[#1f1a16] text-[#7A4C30] border border-gray-100 dark:border-gray-800"
                                )}
                            >
                                {cat.icon}
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Map Content */}
            <div id="discovery-map-container" className="flex-1 min-h-[50vh]">
                <RestaurantMap restaurants={MOCK_RESTAURANTS} />
            </div>

            {/* Featured Card - Offset for Bottom Nav */}
            <div id="discovery-featured-section" className="absolute bottom-32 left-0 w-full px-4 z-10">
                <div id="discovery-featured-card" className="flex items-center gap-4 rounded-2xl bg-white dark:bg-[#1f1a16] p-4 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in slide-in-from-bottom-10 duration-500 relative">
                    {/* Save Button */}
                    <button
                        onClick={() => {
                            // In a real app we would use the actual ID from the featured restaurant
                            const featuredId = '1';
                            useUserStore.getState().toggleSavedRestaurant(featuredId);
                        }}
                        className="absolute top-2 right-2 size-8 flex items-center justify-center rounded-full bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all active:scale-90"
                    >
                        <Heart
                            size={16}
                            className={cn(
                                "transition-colors",
                                useUserStore.getState().savedRestaurants.includes('1')
                                    ? "fill-red-500 text-red-500"
                                    : "text-gray-400"
                            )}
                        />
                    </button>
                    <div className="flex flex-[1.5] flex-col gap-3">
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] font-extrabold tracking-widest text-[#e65c00] uppercase">Featured</span>
                                <div className="h-1 w-1 rounded-full bg-[#e65c00]/30"></div>
                                <div className="flex items-center text-[#e65c00]">
                                    <Star size={12} className="fill-current" />
                                    <span className="text-[11px] font-black ml-1">4.8</span>
                                    <span className="text-[11px] font-bold opacity-50 ml-0.5">(120+)</span>
                                </div>
                            </div>
                            <h3 className="text-base font-extrabold leading-tight text-[#181410] dark:text-white">The Artisan Hearth</h3>
                            <p className="text-[11px] font-bold text-[#7A4C30]/70 dark:text-white/60">Authentic Italian • 0.4 miles away</p>
                        </div>
                        <button
                            onClick={() => navigate('/menu/1')}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e65c00] py-2.5 px-4 text-white shadow-lg shadow-[#e65c00]/20 transition-transform active:scale-95"
                        >
                            <span className="text-xs font-black uppercase tracking-wider">View Menu</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        <img
                            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop"
                            className="h-full w-full object-cover"
                            alt="Artisan Pizza"
                        />
                    </div>
                </div>
            </div>

        </ConsumerLayout>
    );
};
