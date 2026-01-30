import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Bell, Shield, LogOut, ChevronRight, Settings } from 'lucide-react';
import { ConsumerLayout } from '@/components/ConsumerLayout';
import { Card } from '@/components/ui/Card';
import { useUserStore } from '@/store/useUserStore';

export const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useUserStore();

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <ConsumerLayout>
            {/* Header */}
            <div id="profile-header" className="bg-[#181410] pt-12 pb-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#e65c00]/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                <div className="flex items-center justify-between relative z-10 mb-8">
                    <button onClick={() => navigate(-1)} className="size-11 flex items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md">
                        <ArrowLeft size={20} />
                    </button>
                    <button className="size-11 flex items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md">
                        <Settings size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-5 relative z-10">
                    <div className="size-20 rounded-3xl bg-[#e65c00] flex items-center justify-center shadow-xl shadow-orange-950/20 border border-white/10">
                        <User size={36} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white">{user?.name || 'Guest User'}</h1>
                        <p className="text-[#e65c00] text-xs font-black uppercase tracking-widest">{user?.isGuest ? 'Temporary Account' : 'Gold Member'}</p>
                    </div>
                </div>
            </div>

            <div id="profile-content" className="px-4 -mt-12 relative z-20 space-y-4 pb-32">
                {/* Personal Info */}
                <Card className="p-5 border-none shadow-xl flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                            <Mail size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Email Address</p>
                            <p className="text-sm font-bold">{user?.email || 'not connected'}</p>
                        </div>
                        <ChevronRight size={16} className="text-gray-300" />
                    </div>

                    <div className="flex items-center gap-4 border-t border-gray-50 dark:border-gray-800 pt-5">
                        <div className="size-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                            <Phone size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Phone Number</p>
                            <p className="text-sm font-bold">{user?.phone || 'not provided'}</p>
                        </div>
                        <ChevronRight size={16} className="text-gray-300" />
                    </div>
                </Card>

                {/* Settings Group */}
                <div className="pt-4 space-y-3">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Preferences</h3>
                    <Card className="p-1 border-none shadow-lg">
                        <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-2xl group">
                            <div className="size-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                <MapPin size={18} />
                            </div>
                            <span className="flex-1 text-left text-sm font-bold">Saved Addresses</span>
                            <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-2xl group border-t border-gray-50 dark:border-gray-800">
                            <div className="size-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                                <Bell size={18} />
                            </div>
                            <span className="flex-1 text-left text-sm font-bold">Notifications</span>
                            <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-2xl group border-t border-gray-50 dark:border-gray-800">
                            <div className="size-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center">
                                <Shield size={18} />
                            </div>
                            <span className="flex-1 text-left text-sm font-bold">Privacy & Security</span>
                            <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Card>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full mt-8 p-4 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-600 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all active:scale-95"
                >
                    <LogOut size={18} />
                    Sign Out Account
                </button>
            </div>
        </ConsumerLayout>
    );
};
