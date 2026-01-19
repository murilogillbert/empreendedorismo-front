import React from 'react';
import { ChevronLeft, ShieldCheck, ShieldAlert, User, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ManagerLayout } from '@/components/ManagerLayout';
import { Card } from '@/components/ui/Card';

export const EmployeeAccess: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    console.log('Employee ID:', id);

    // In a real app, we would fetch the employee data by ID
    const employee = {
        name: 'Alice Johnson',
        role: 'Server',
        permissions: [
            { id: 'view_orders', label: 'View Orders', description: 'Can see active orders in the lounge', granted: true },
            { id: 'create_orders', label: 'Create Orders', description: 'Can launch new orders for tables', granted: true },
            { id: 'cancel_orders', label: 'Cancel Orders', description: 'Can remove items from orders', granted: false },
            { id: 'apply_discounts', label: 'Apply Discounts', description: 'Can apply coupons or bill adjustments', granted: false },
            { id: 'manage_staff', label: 'Manage Staff', description: 'Full access to team management', granted: false },
        ]
    };

    return (
        <ManagerLayout>
            <header className="pt-2 pb-6 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 bg-white dark:bg-[#2d343c] rounded-xl border border-gray-100 dark:border-gray-800 soft-shadow"
                >
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-extrabold tracking-tight">Access Control</h1>
                    <p className="text-[#5d7f89] text-xs">Manage permissions for {employee.name}</p>
                </div>
            </header>

            <div className="space-y-6">
                {/* Profile Card */}
                <Card className="flex items-center gap-4">
                    <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <User size={32} />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-lg">{employee.name}</h3>
                        <p className="text-[#5d7f89] text-sm font-medium">{employee.role}</p>
                    </div>
                </Card>

                {/* Permissions List */}
                <section>
                    <h3 className="text-xs font-bold text-[#5d7f89] uppercase tracking-widest px-1 mb-3">Modular Permissions</h3>
                    <div className="space-y-3">
                        {employee.permissions.map(perm => (
                            <Card key={perm.id} className="p-4 flex items-center gap-4">
                                <div className={`p-2 rounded-xl ${perm.granted ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                    {perm.granted ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm tracking-tight">{perm.label}</h4>
                                    <p className="text-[10px] text-[#5d7f89] mt-0.5">{perm.description}</p>
                                </div>
                                <div className={`w-10 h-6 rounded-full relative transition-colors ${perm.granted ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                    <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${perm.granted ? 'right-1' : 'left-1'}`}></div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                <button className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-4 active:scale-[0.98]">
                    <Save size={20} />
                    Update Privileges
                </button>
            </div>
        </ManagerLayout>
    );
};
