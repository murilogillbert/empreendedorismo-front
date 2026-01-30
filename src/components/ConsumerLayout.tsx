import React from 'react';
import { Compass, ReceiptText, QrCode, Heart, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ConsumerLayoutProps {
    children: React.ReactNode;
}

export const ConsumerLayout: React.FC<ConsumerLayoutProps> = ({ children }) => {
    return (
        <div id="consumer-layout-root" className="min-h-screen bg-gray-50 dark:bg-[#181410] text-[#181410] dark:text-white font-sans selection:bg-[#e65c00]/30">
            {/* Mobile Viewport Container */}
            <div id="consumer-mobile-container" className="max-w-md mx-auto min-h-screen bg-white dark:bg-[#1f1a16] shadow-2xl relative flex flex-col">

                {/* Main Content Area */}
                <main id="consumer-main-content" className="flex-1 pb-32">
                    {children}
                </main>

                {/* Bottom Navigation Bar */}
                <nav id="consumer-bottom-nav" className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4 bg-white/95 dark:bg-[#1f1a16]/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800">
                    <div id="consumer-nav-links" className="flex items-center justify-between max-w-md mx-auto">

                        <NavLink
                            to="/explore"
                            className={({ isActive }) => cn(
                                "flex flex-col items-center gap-1 transition-colors",
                                isActive ? "text-[#e65c00]" : "text-[#7A4C30]/50 dark:text-white/50"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <Compass size={24} className={isActive ? "fill-current" : ""} />
                                    <span className="text-[10px] font-bold">Explore</span>
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to="/sessions"
                            className={({ isActive }) => cn(
                                "flex flex-col items-center gap-1 transition-colors",
                                isActive ? "text-[#e65c00]" : "text-[#7A4C30]/50 dark:text-white/50"
                            )}
                        >
                            <ReceiptText size={24} />
                            <span className="text-[10px] font-bold">Sessions</span>
                        </NavLink>

                        {/* Central QR Button */}
                        <div className="relative -top-3">
                            <div className="absolute -inset-2 rounded-full bg-white dark:bg-[#1f1a16] shadow-lg"></div>
                            <button className="relative flex size-14 items-center justify-center rounded-full bg-[#e65c00] text-white shadow-xl shadow-[#e65c00]/40 transition-transform active:scale-90 z-10">
                                <QrCode size={28} />
                            </button>
                        </div>

                        <NavLink
                            to="/saved"
                            className={({ isActive }) => cn(
                                "flex flex-col items-center gap-1 transition-colors",
                                isActive ? "text-[#e65c00]" : "text-[#7A4C30]/50 dark:text-white/50"
                            )}
                        >
                            <Heart size={24} />
                            <span className="text-[10px] font-bold">Saved</span>
                        </NavLink>

                        <NavLink
                            to="/profile"
                            className={({ isActive }) => cn(
                                "flex flex-col items-center gap-1 transition-colors",
                                isActive ? "text-[#e65c00]" : "text-[#7A4C30]/50 dark:text-white/50"
                            )}
                        >
                            <User size={24} />
                            <span className="text-[10px] font-bold">Profile</span>
                        </NavLink>
                    </div>
                </nav>

                {/* Home Indicator */}
                <div className="absolute bottom-1 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full bg-black/10 dark:bg-white/10 pointer-events-none"></div>
            </div>
        </div>
    );
};
