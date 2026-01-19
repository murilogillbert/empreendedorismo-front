import React from 'react';
import { Home, Menu as MenuIcon, Users, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ManagerLayoutProps {
    children: React.ReactNode;
}

export const ManagerLayout: React.FC<ManagerLayoutProps> = ({ children }) => {
    const location = useLocation();
    const activeTab = location.pathname;

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#111718] dark:text-gray-100 min-h-screen pb-24 transition-colors">
            {/* Top Navigation */}
            <nav className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between px-5 h-16 max-w-md mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Home className="text-primary w-6 h-6" />
                        </div>
                        <h2 className="text-[#111718] dark:text-white text-lg font-extrabold tracking-tight">Gourmet Plaza</h2>
                    </div>
                    <button className="p-2 text-[#5d7f89] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="px-5 mt-4 max-w-md mx-auto">
                {children}
            </main>

            {/* Bottom Navigation Bar (iOS Style) */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-background-dark/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 px-6 pb-6 pt-3 z-50">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <NavItem to="/" icon={<Home className="w-6 h-6" />} label="Home" active={activeTab === '/'} />
                    <NavItem to="/menu" icon={<MenuIcon className="w-6 h-6" />} label="Menu" active={activeTab === '/menu'} />
                    <NavItem to="/staff" icon={<Users className="w-6 h-6" />} label="Staff" active={activeTab === '/staff'} />
                    <NavItem to="/settings" icon={<Settings className="w-6 h-6" />} label="Settings" active={activeTab === '/settings'} />
                </div>
            </nav>

            {/* iOS Indicator Area */}
            <div className="fixed bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 dark:bg-gray-700 rounded-full z-[60]"></div>
        </div>
    );
};

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => (
    <Link to={to} className={cn(
        "flex flex-col items-center gap-1 transition-colors",
        active ? "text-primary" : "text-gray-400 dark:text-gray-500"
    )}>
        {icon}
        <span className="text-[10px] font-bold">{label}</span>
    </Link>
);
