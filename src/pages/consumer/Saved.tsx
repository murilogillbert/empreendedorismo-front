import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Star, Heart, MapPin, Search } from 'lucide-react';
import { ConsumerLayout } from '@/components/ConsumerLayout';
import { Card } from '@/components/ui/Card';
import { useUserStore } from '@/store/useUserStore';

// Shared mock data with Discovery.tsx but expanded for the list view
const ALL_RESTAURANTS = [
    {
        id: '1',
        name: 'The Artisan Hearth',
        category: 'Italian • Artisanal Pizza',
        rating: 4.8,
        reviews: 120,
        distance: '0.4 miles',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop',
        tags: ['Wood-fire', 'Organic']
    },
    {
        id: '2',
        name: 'Suki Sushi',
        category: 'Japanese • Fine Dining',
        rating: 4.9,
        reviews: 85,
        distance: '1.2 miles',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop',
        tags: ['Fresh Fish', 'Omakase']
    },
    {
        id: '3',
        name: 'Cafe Noir',
        category: 'French • Specialty Coffee',
        rating: 4.6,
        reviews: 210,
        distance: '0.8 miles',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop',
        tags: ['Cozy', 'Pastries']
    },
    {
        id: '4',
        name: 'Green Leaf Bowls',
        category: 'Healthy • Vegan',
        rating: 4.7,
        reviews: 56,
        distance: '1.5 miles',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop',
        tags: ['Non-GMO', 'Gluten Free']
    }
];

export const Saved: React.FC = () => {
    const navigate = useNavigate();
    const { savedRestaurants, toggleSavedRestaurant } = useUserStore();

    const savedList = ALL_RESTAURANTS.filter(r => savedRestaurants.includes(r.id));

    return (
        <ConsumerLayout>
            {/* Header */}
            <div id="saved-header" className="sticky top-0 z-50 bg-white/95 dark:bg-[#1f1a16]/95 backdrop-blur-md px-4 py-6 border-b border-gray-100 dark:border-gray-800">
                <div id="saved-header-content" className="flex items-center justify-between max-w-md mx-auto">
                    <div className="flex items-center gap-4">
                        <button
                            id="saved-back-button"
                            onClick={() => navigate(-1)}
                            className="size-11 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 transition-all active:scale-90"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 id="saved-title" className="text-2xl font-black tracking-tight leading-tight">My Favorites</h1>
                            <p id="saved-subtitle" className="text-[10px] text-[#e65c00] font-black uppercase tracking-widest">{savedList.length} Places Saved</p>
                        </div>
                    </div>
                </div>
            </div>

            <div id="saved-content" className="p-4 space-y-6 max-w-md mx-auto pb-64">
                {savedList.length === 0 ? (
                    <div id="saved-empty-state" className="flex flex-col items-center justify-center pt-20 text-center space-y-6">
                        <div className="size-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-200 dark:text-gray-700 animate-pulse">
                            <Heart size={40} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-black text-gray-400">Your collection is empty</h2>
                            <p className="text-sm text-gray-300 font-medium px-8">Save your favorite restaurants to find them easily next time.</p>
                        </div>
                        <button
                            onClick={() => navigate('/explore')}
                            className="flex items-center gap-2 px-8 py-3.5 bg-[#e65c00] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#e65c00]/20 active:scale-95 transition-all"
                        >
                            <Search size={16} />
                            Explore Restaurants
                        </button>
                    </div>
                ) : (
                    savedList.map((restaurant) => (
                        <Card
                            key={restaurant.id}
                            id={`saved-restaurant-${restaurant.id}`}
                            className="overflow-hidden border-none shadow-xl bg-white dark:bg-[#1f1a16] group hover:shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={restaurant.image}
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSavedRestaurant(restaurant.id);
                                    }}
                                    className="absolute top-4 right-4 size-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 active:scale-90 transition-all hover:bg-white hover:text-red-500"
                                >
                                    <Heart size={20} className="fill-red-500 text-red-500" />
                                </button>

                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            {restaurant.tags.map(tag => (
                                                <span key={tag} className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-md text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 className="text-lg font-black text-white tracking-tight">{restaurant.name}</h3>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-white/95 dark:bg-[#1f1a16]/95 px-3 py-1.5 rounded-xl shadow-lg border border-white/20">
                                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-xs font-black">{restaurant.rating}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                        <MapPin size={10} className="text-[#e65c00]" />
                                        {restaurant.category} • {restaurant.distance}
                                    </p>
                                    <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.15em] flex items-center gap-1.5">
                                        <MessageSquare size={10} />
                                        {restaurant.reviews} Gourmet Reviews
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate(`/menu/${restaurant.id}`)}
                                    className="px-6 py-3 bg-[#181410] hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95"
                                >
                                    Book Now
                                </button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </ConsumerLayout>
    );
};
