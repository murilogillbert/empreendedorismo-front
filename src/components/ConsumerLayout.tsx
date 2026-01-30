import { Compass, ReceiptText, QrCode, Heart, User, UtensilsCrossed } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';

interface ConsumerLayoutProps {
    children: React.ReactNode;
}

export const ConsumerLayout: React.FC<ConsumerLayoutProps> = ({ children }) => {
    const { activeSessionId, currentRestaurantId, setSession } = useUserStore();

    const getNavLinks = () => {
        if (activeSessionId || currentRestaurantId) {
            return [
                { to: "/menu", label: "Menu", icon: UtensilsCrossed },
                { to: "/orders", label: "Orders", icon: ReceiptText },
                { to: "/bill", label: "Bill", icon: ReceiptText },
                { to: "/profile", label: "Profile", icon: User },
            ];
        }

        return [
            { to: "/explore", label: "Explore", icon: Compass },
            { to: "/sessions", label: "Sessions", icon: ReceiptText },
            { to: "/saved", label: "Saved", icon: Heart },
            { to: "/profile", label: "Profile", icon: User },
        ];
    };

    const navLinks = getNavLinks();

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

                        {navLinks.slice(0, 2).map((link) => (
                            <NavLink
                                key={link.to}
                                id={`nav-link-${link.label.toLowerCase()}`}
                                to={link.to}
                                className={({ isActive }) => cn(
                                    "flex flex-col items-center gap-1 transition-colors",
                                    isActive ? "text-[#e65c00]" : "text-[#7A4C30]/50 dark:text-white/50"
                                )}
                            >
                                <link.icon size={24} />
                                <span className="text-[10px] font-bold">{link.label}</span>
                            </NavLink>
                        ))}

                        {/* Central QR Button */}
                        <div id="central-qr-wrapper" className="relative -top-3">
                            <div className="absolute -inset-2 rounded-full bg-white dark:bg-[#1f1a16] shadow-lg"></div>
                            <button
                                id="nav-qr-button"
                                onClick={() => setSession(activeSessionId ? null : 'MOCK-SESSION-123')}
                                className={cn(
                                    "relative flex size-14 items-center justify-center rounded-full text-white shadow-xl transition-all active:scale-90 z-10",
                                    activeSessionId ? "bg-black shadow-black/20" : "bg-[#e65c00] shadow-[#e65c00]/40"
                                )}
                            >
                                <QrCode size={28} />
                            </button>
                        </div>

                        {navLinks.slice(2).map((link) => (
                            <NavLink
                                key={link.to}
                                id={`nav-link-${link.label.toLowerCase()}`}
                                to={link.to}
                                className={({ isActive }) => cn(
                                    "flex flex-col items-center gap-1 transition-colors",
                                    isActive ? "text-[#e65c00]" : "text-[#7A4C30]/50 dark:text-white/50"
                                )}
                            >
                                <link.icon size={24} />
                                <span className="text-[10px] font-bold">{link.label}</span>
                            </NavLink>
                        ))}
                    </div>
                </nav>

                {/* Home Indicator */}
                <div className="absolute bottom-1 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full bg-black/10 dark:bg-white/10 pointer-events-none"></div>
            </div>
        </div>
    );
};
