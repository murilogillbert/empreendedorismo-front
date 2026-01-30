import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { ConsumerLayout } from '@/components/ConsumerLayout';
import { Card } from '@/components/ui/Card';
import { useUserStore } from '@/store/useUserStore';

export const Auth: React.FC = () => {
    const navigate = useNavigate();
    const identify = useUserStore((state) => state.identify);
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        identify({
            name: isLogin ? formData.email.split('@')[0] : formData.name, // Mocking name for login
            email: formData.email,
            phone: isLogin ? undefined : formData.phone,
            isGuest: false
        });
        navigate(-1);
    };

    return (
        <ConsumerLayout>
            <div id="auth-container" className="p-6 pt-12 space-y-8 max-w-md mx-auto pb-32">
                <div id="auth-header" className="text-center space-y-2">
                    <h1 id="auth-title" className="text-3xl font-black tracking-tight text-[#181410] dark:text-white">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p id="auth-subtitle" className="text-[#7A4C30]/60 text-sm font-medium">
                        {isLogin ? 'Join us for a gourmet experience' : 'Sign up to manage your orders and reservations'}
                    </p>
                </div>

                <Card id="auth-card" className="p-8 border-none shadow-2xl bg-white/50 dark:bg-[#1f1a16]/50 backdrop-blur-xl rounded-[2.5rem]">
                    <form id="auth-form" onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div id="auth-input-name-wrapper" className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#7A4C30] uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input
                                        id="auth-input-name"
                                        required
                                        type="text"
                                        placeholder="Michael Scott"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white dark:bg-zinc-800 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold shadow-sm focus:ring-2 focus:ring-[#e65c00]/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div id="auth-input-email-wrapper" className="space-y-1.5">
                            <label className="text-[10px] font-black text-[#7A4C30] uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    id="auth-input-email"
                                    required
                                    type="email"
                                    placeholder="michael@dundermifflin.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white dark:bg-zinc-800 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold shadow-sm focus:ring-2 focus:ring-[#e65c00]/20 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div id="auth-input-phone-wrapper" className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#7A4C30] uppercase tracking-widest ml-1">Cellphone</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input
                                        id="auth-input-phone"
                                        required
                                        type="tel"
                                        placeholder="(11) 99999-0000"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-white dark:bg-zinc-800 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold shadow-sm focus:ring-2 focus:ring-[#e65c00]/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div id="auth-input-password-wrapper" className="space-y-1.5">
                            <label className="text-[10px] font-black text-[#7A4C30] uppercase tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    id="auth-input-password"
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white dark:bg-zinc-800 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold shadow-sm focus:ring-2 focus:ring-[#e65c00]/20 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <button id="auth-submit-button" className="w-full bg-[#181410] hover:bg-black text-white font-black py-4.5 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 group mt-2 uppercase tracking-widest text-xs">
                            {isLogin ? 'Sign In' : 'Create Account'}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div id="auth-toggle-wrapper" className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
                        <p id="auth-toggle-text" className="text-xs font-medium text-gray-400">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                        </p>
                        <button
                            id="auth-toggle-button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="mt-2 text-sm font-black text-[#e65c00] hover:underline transition-all uppercase tracking-widest"
                        >
                            {isLogin ? 'Register Now' : 'Sign In instead'}
                        </button>
                    </div>
                </Card>

                <p id="auth-footer-disclaimer" className="text-[10px] text-center text-gray-400 font-medium px-4 leading-relaxed">
                    By continuing, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
                </p>
            </div>
        </ConsumerLayout>
    );
};
