import React from 'react';
import { CreditCard, Lock, Globe, Smartphone, HelpCircle, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ManagerLayout } from '@/components/ManagerLayout';
import { Card } from '@/components/ui/Card';

export const Settings: React.FC = () => {
    return (
        <ManagerLayout>
            <header className="pt-2 pb-6">
                <h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>
                <p className="text-[#5d7f89] text-sm mt-1">Configure restaurant preferences</p>
            </header>

            <div className="space-y-6">
                {/* Payment Policy */}
                <section>
                    <h3 className="text-xs font-bold text-[#5d7f89] uppercase tracking-widest px-1 mb-3">Restaurant Policy</h3>
                    <Card className="p-0 overflow-hidden">
                        <div className="divide-y divide-gray-50 dark:divide-gray-800">
                            <SettingItem
                                icon={<CreditCard className="text-blue-500" size={20} />}
                                title="Payment Split"
                                description="Allow customers to split bills"
                                toggle={true}
                                defaultChecked={true}
                            />
                            <SettingItem
                                icon={<Lock className="text-orange-500" size={20} />}
                                title="Pre-payment"
                                description="Require payment before order"
                                toggle={true}
                                defaultChecked={false}
                            />
                            <SettingItem
                                icon={<Smartphone className="text-purple-500" size={20} />}
                                title="Digital Menu"
                                description="Enable QR Code ordering"
                                toggle={true}
                                defaultChecked={true}
                            />
                            <Link to="/settings/advanced">
                                <SettingItem
                                    icon={<Settings2 className="text-primary" size={20} />}
                                    title="Advanced Policies"
                                    description="Taxes, Fees and Operational rules"
                                />
                            </Link>
                        </div>
                    </Card>
                </section>

                {/* Support */}
                <section>
                    <h3 className="text-xs font-bold text-[#5d7f89] uppercase tracking-widest px-1 mb-3">Support & Help</h3>
                    <Card className="p-0 overflow-hidden">
                        <div className="divide-y divide-gray-50 dark:divide-gray-800">
                            <Link to="/help">
                                <SettingItem
                                    icon={<HelpCircle className="text-primary" size={20} />}
                                    title="Help Center"
                                    description="Read documentation and guides"
                                />
                            </Link>
                            <SettingItem
                                icon={<Globe className="text-teal-500" size={20} />}
                                title="Language"
                                description="Change application language"
                                value="Portuguese (BR)"
                            />
                        </div>
                    </Card>
                </section>

                <button className="w-full py-4 text-red-500 font-bold text-sm bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 active:scale-95 transition-all">
                    Logout Account
                </button>
            </div>
        </ManagerLayout>
    );
};

interface SettingItemProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    toggle?: boolean;
    defaultChecked?: boolean;
    value?: string;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, title, description, toggle, defaultChecked, value }) => (
    <div className="flex items-center gap-4 p-4 active:bg-gray-50 dark:active:bg-[#353c45] transition-colors cursor-pointer">
        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
            {icon}
        </div>
        <div className="flex-1">
            <h4 className="font-bold text-sm">{title}</h4>
            <p className="text-[11px] text-[#5d7f89]">{description}</p>
        </div>
        {toggle ? (
            <div className={`w-10 h-6 rounded-full relative transition-colors ${defaultChecked ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${defaultChecked ? 'right-1' : 'left-1'}`}></div>
            </div>
        ) : value ? (
            <span className="text-xs font-bold text-[#5d7f89]">{value}</span>
        ) : (
            <span className="material-symbols-outlined text-gray-300">chevron_right</span>
        )}
    </div>
);
