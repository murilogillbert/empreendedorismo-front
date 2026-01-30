import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    HelpCircle,
    Calendar,
    CheckCircle2,
    Info,
    ChevronRight,
    Armchair,
    Trees,
    Users
} from 'lucide-react';
import { ConsumerLayout } from '@/components/ConsumerLayout';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';

const DATES = [
    { month: 'MAY', day: '24', weekday: 'Fri' },
    { month: 'MAY', day: '25', weekday: 'Sat' },
    { month: 'MAY', day: '26', weekday: 'Sun' },
    { month: 'MAY', day: '27', weekday: 'Mon' },
];

const TIMES = ['18:00', '19:30', '20:00', '21:00', '21:30', '22:00'];

const GUEST_COUNTS = ['2', '3', '4', '5', '6', '8+'];

export const Reservations: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user, identify, setCurrentRestaurant } = useUserStore();
    const [seating, setSeating] = useState<'INDOOR' | 'OUTDOOR'>('INDOOR');
    const [selectedDate, setSelectedDate] = useState('24');
    const [selectedTime, setSelectedTime] = useState('19:30');
    const [selectedGuests, setSelectedGuests] = useState('2');
    const [showIdentityModal, setShowIdentityModal] = useState(false);
    const [guestData, setGuestData] = useState({ name: '', contact: '' });

    React.useEffect(() => {
        if (id) {
            setCurrentRestaurant(id);
        }
    }, [id, setCurrentRestaurant]);

    const handleConfirm = () => {
        if (!user) {
            setShowIdentityModal(true);
            return;
        }
        alert('Reservation Confirmed for ' + (id === '1' ? 'The Artisan Hearth' : 'Restaurant ' + id));
        navigate('/');
    };

    const handleGuestIdentify = (e: React.FormEvent) => {
        e.preventDefault();
        identify({
            name: guestData.name,
            phone: guestData.contact,
            isGuest: true
        });
        setShowIdentityModal(false);
        alert('Reservation Confirmed for ' + guestData.name);
        navigate('/');
    };

    return (
        <ConsumerLayout>
            {/* Header */}
            <div id="reserve-header" className="sticky top-0 z-50 flex items-center bg-white/95 dark:bg-[#1f1a16]/95 backdrop-blur-md px-4 py-4 justify-between border-b border-gray-100 dark:border-gray-800">
                <div id="reserve-header-info" className="flex items-center gap-3">
                    <button id="reserve-back-button" onClick={() => navigate(-1)} className="size-11 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 active:scale-90 transition-transform">
                        <ArrowLeft size={20} />
                    </button>
                    <div id="reserve-restaurant-details">
                        <h1 id="reserve-title" className="text-xl font-black leading-tight tracking-tight">Reserve a Table</h1>
                        <p id="reserve-restaurant-info" className="text-[10px] text-[#e65c00] font-black uppercase tracking-widest flex items-center gap-1">
                            The Gourmet Kitchen <span className="text-gray-300">•</span> Fine Dining
                        </p>
                    </div>
                </div>
                <button id="reserve-help-button" className="size-11 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
                    <HelpCircle size={20} className="text-[#7A4C30]/50" />
                </button>
            </div>

            <div id="reserve-content" className="p-4 pb-64 space-y-10 pt-8 max-w-lg mx-auto">
                {/* Guest Count */}
                <section id="reserve-guests-section" className="space-y-5">
                    <div id="reserve-guests-header" className="flex items-center gap-2.5 px-1">
                        <Users size={20} className="text-[#e65c00]" />
                        <h2 id="reserve-guests-title" className="text-xs font-black uppercase tracking-[0.2em] text-[#7A4C30]/50">How many guests?</h2>
                    </div>
                    <div id="reserve-guests-scroll" className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                        {GUEST_COUNTS.map(count => (
                            <button
                                key={count}
                                id={`reserve-guest-count-${count}`}
                                onClick={() => setSelectedGuests(count)}
                                className={cn(
                                    "flex flex-col items-center justify-center min-w-[65px] h-[65px] rounded-2xl border-2 transition-all active:scale-90",
                                    selectedGuests === count
                                        ? "bg-[#e65c00] text-white border-[#e65c00] shadow-xl shadow-[#e65c00]/25"
                                        : "bg-white dark:bg-[#1f1a16] text-[#7A4C30] border-gray-100 dark:border-gray-800"
                                )}
                            >
                                <span className="text-lg font-black">{count}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Seating Preference */}
                <section id="reserve-seating-section" className="space-y-5">
                    <div id="reserve-seating-header" className="flex items-center gap-2.5 px-1">
                        <Armchair size={20} className="text-[#e65c00]" />
                        <h2 id="reserve-seating-title" className="text-xs font-black uppercase tracking-[0.2em] text-[#7A4C30]/50">Where do you prefer?</h2>
                    </div>
                    <div id="reserve-seating-grid" className="grid grid-cols-2 gap-4">
                        <button
                            id="reserve-seat-indoor"
                            onClick={() => setSeating('INDOOR')}
                            className={cn(
                                "relative flex flex-col items-center justify-center p-8 bg-white dark:bg-[#1f1a16] border-2 rounded-[2.5rem] shadow-sm transition-all active:scale-95 group",
                                seating === 'INDOOR' ? "border-[#e65c00] ring-8 ring-[#e65c00]/5" : "border-gray-50 dark:border-gray-800"
                            )}
                        >
                            <Armchair size={36} className={cn("mb-3 transition-colors", seating === 'INDOOR' ? "text-[#e65c00]" : "text-gray-300 group-hover:text-gray-400")} />
                            <span className="font-black text-sm text-[#181410] dark:text-white">Indoor</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mt-0.5">Lounge / AC</span>
                            {seating === 'INDOOR' && (
                                <div id="reserve-seat-indoor-check" className="absolute top-4 right-4 text-[#e65c00] animate-in zoom-in-50">
                                    <CheckCircle2 size={24} fill="currentColor" className="text-white ring-4 ring-white dark:ring-[#1f1a16] rounded-full" />
                                </div>
                            )}
                        </button>
                        <button
                            id="reserve-seat-outdoor"
                            onClick={() => setSeating('OUTDOOR')}
                            className={cn(
                                "relative flex flex-col items-center justify-center p-8 bg-white dark:bg-[#1f1a16] border-2 rounded-[2.5rem] shadow-sm transition-all active:scale-95 group",
                                seating === 'OUTDOOR' ? "border-[#e65c00] ring-8 ring-[#e65c00]/5" : "border-gray-50 dark:border-gray-800"
                            )}
                        >
                            <Trees size={36} className={cn("mb-3 transition-colors", seating === 'OUTDOOR' ? "text-[#e65c00]" : "text-gray-300 group-hover:text-gray-400")} />
                            <span className="font-black text-sm text-[#181410] dark:text-white">Outdoor</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mt-0.5">Patio / Garden</span>
                            {seating === 'OUTDOOR' && (
                                <div id="reserve-seat-outdoor-check" className="absolute top-4 right-4 text-[#e65c00] animate-in zoom-in-50">
                                    <CheckCircle2 size={24} fill="currentColor" className="text-white ring-4 ring-white dark:ring-[#1f1a16] rounded-full" />
                                </div>
                            )}
                        </button>
                    </div>
                </section>

                {/* Date & Time Selection */}
                <section id="reserve-schedule-section" className="space-y-6">
                    <div id="reserve-schedule-header" className="flex items-center gap-2.5 px-1">
                        <Calendar size={20} className="text-[#e65c00]" />
                        <h2 id="reserve-schedule-title" className="text-xs font-black uppercase tracking-[0.2em] text-[#7A4C30]/50">Choose a Date</h2>
                    </div>

                    <div id="reserve-date-scroll" className="flex gap-4 overflow-x-auto no-scrollbar pb-3">
                        {DATES.map(d => (
                            <button
                                key={d.day}
                                id={`reserve-date-${d.day}`}
                                onClick={() => setSelectedDate(d.day)}
                                className={cn(
                                    "flex flex-col items-center justify-center min-w-[78px] py-5 rounded-[1.5rem] border-2 transition-all active:scale-95",
                                    selectedDate === d.day
                                        ? "bg-[#e65c00] text-white border-[#e65c00] shadow-xl shadow-[#e65c00]/25 scale-105"
                                        : "bg-white dark:bg-[#1f1a16] text-[#7A4C30] border-gray-100 dark:border-gray-800"
                                )}
                            >
                                <span className="text-[10px] uppercase font-black tracking-widest opacity-60 mb-1">{d.month}</span>
                                <span className="text-2xl font-black leading-none mb-1">{d.day}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{d.weekday}</span>
                            </button>
                        ))}
                    </div>

                    <div id="reserve-time-grid" className="grid grid-cols-3 gap-3 pt-2">
                        {TIMES.map(t => (
                            <button
                                key={t}
                                id={`reserve-time-${t.replace(':', '')}`}
                                onClick={() => setSelectedTime(t)}
                                className={cn(
                                    "py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 border-2",
                                    selectedTime === t
                                        ? "bg-[#e65c00]/5 text-[#e65c00] border-[#e65c00]"
                                        : "bg-gray-50 dark:bg-zinc-800 border-transparent text-gray-500"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Policy Alert */}
                <section id="reserve-policy-section" className="bg-[#7A4C30]/5 dark:bg-orange-900/10 p-6 rounded-[2.5rem] border border-[#7A4C30]/10 dark:border-orange-800/20">
                    <div id="reserve-policy-content" className="flex gap-5">
                        <div id="reserve-policy-icon" className="size-11 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-110">
                            <Info size={22} className="text-[#e65c00]" />
                        </div>
                        <div id="reserve-policy-text" className="space-y-2.5">
                            <p id="reserve-policy-tag" className="text-xs font-black text-[#7A4C30] dark:text-[#e65c00] uppercase tracking-[0.15em]">Reservation Policy</p>
                            <ul id="reserve-policy-list" className="text-[11px] space-y-2.5 text-gray-500 dark:text-white/40 font-bold leading-relaxed list-disc ml-3.5">
                                <li>A <b>R$ 50.00 reservation fee</b> applies (fully deductible).</li>
                                <li><b>Free cancellation</b> up to 2 hours before the time.</li>
                                <li>Reservations are held for a maximum of 15 minutes.</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>

            {/* Bottom Confirmation Bar - Offset for Bottom Nav */}
            <div id="reserve-confirmation-bar" className="fixed bottom-24 left-4 right-4 bg-white/95 dark:bg-[#1f1a16]/95 backdrop-blur-xl border border-gray-100 dark:border-gray-800 p-5 rounded-[2.5rem] z-50 shadow-2xl">
                <div id="reserve-confirmation-container" className="max-w-md mx-auto flex flex-col gap-5">
                    <div id="reserve-confirmation-info" className="flex justify-between items-center px-2">
                        <div id="reserve-total-due">
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-0.5">Total due now</span>
                            <span id="reserve-total-price" className="text-3xl font-black text-[#181410] dark:text-white">R$ 50.00</span>
                        </div>
                        <div id="reserve-deductible-info" className="text-right">
                            <span className="text-[10px] text-[#e65c00] font-black uppercase tracking-widest block mb-0.5">Deductible fee</span>
                            <span className="text-sm font-bold text-gray-400 italic">Applied at bill</span>
                        </div>
                    </div>
                    <button
                        id="reserve-confirm-button"
                        onClick={handleConfirm}
                        className="w-full bg-[#181410] hover:bg-black transition-all py-5.5 rounded-[2.5rem] text-white font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-2xl active:scale-95 group"
                    >
                        Confirm Booking
                        <ChevronRight size={20} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Quick Identity Modal (Guest Flow) */}
            {showIdentityModal && (
                <div id="reserve-identity-overlay" className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-4 px-6">
                    <div id="reserve-identity-modal" className="w-full max-w-sm bg-white dark:bg-[#1f1a16] rounded-[2.5rem] p-10 shadow-2xl animate-in slide-in-from-bottom-full duration-600 border border-white/10 ring-1 ring-black/5">
                        <div id="reserve-identity-header" className="text-center space-y-3 mb-10">
                            <div className="size-16 bg-[#e65c00]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#e65c00] ring-4 ring-[#e65c00]/5">
                                <Users size={28} />
                            </div>
                            <h3 id="reserve-identity-title" className="text-2xl font-black tracking-tight text-[#181410] dark:text-white">Quick Review</h3>
                            <p id="reserve-identity-desc" className="text-[#7A4C30]/50 text-xs font-semibold leading-relaxed">Confirm your details to finalize your reservation</p>
                        </div>

                        <form id="reserve-identity-form" onSubmit={handleGuestIdentify} className="space-y-5">
                            <div id="reserve-input-name-wrapper" className="space-y-2">
                                <label className="text-[10px] font-black text-[#7A4C30] uppercase tracking-widest ml-2">Full Name</label>
                                <input
                                    id="reserve-guest-name"
                                    required
                                    type="text"
                                    placeholder="Michael Scott"
                                    value={guestData.name}
                                    onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4.5 px-6 text-sm font-bold focus:ring-[3px] focus:ring-[#e65c00]/15 outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>
                            <div id="reserve-input-contact-wrapper" className="space-y-2">
                                <label className="text-[10px] font-black text-[#7A4C30] uppercase tracking-widest ml-2">Email or Cellphone</label>
                                <input
                                    id="reserve-guest-contact"
                                    required
                                    type="text"
                                    placeholder="michael@dundermifflin.com"
                                    value={guestData.contact}
                                    onChange={(e) => setGuestData({ ...guestData, contact: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4.5 px-6 text-sm font-bold focus:ring-[3px] focus:ring-[#e65c00]/15 outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>
                            <button id="reserve-guest-submit" className="w-full bg-[#e65c00] text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-[#e65c00]/30 mt-6 active:scale-95 transition-all hover:bg-orange-600 uppercase tracking-[0.25em] text-[10px]">
                                Confirm Reservation
                            </button>
                            <button
                                id="reserve-login-link"
                                type="button"
                                onClick={() => navigate('/auth')}
                                className="w-full text-[10px] font-black text-gray-400 hover:text-[#e65c00] uppercase tracking-widest pt-4 transition-colors flex items-center justify-center gap-2"
                            >
                                Have an account? Login
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </ConsumerLayout>
    );
};
