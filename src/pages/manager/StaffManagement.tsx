import React from 'react';
import { UserPlus, Star, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ManagerLayout } from '@/components/ManagerLayout';
import { Card } from '@/components/ui/Card';

interface StaffMember {
    id: number;
    name: string;
    role: string;
    status: 'online' | 'offline';
    shift: string;
}

const MOCK_STAFF: StaffMember[] = [
    { id: 1, name: 'Alice Johnson', role: 'Server', status: 'online', shift: 'Morning' },
    { id: 2, name: 'Bob Smith', role: 'Chef', status: 'online', shift: 'All Day' },
    { id: 3, name: 'Charlie Davis', role: 'Bartender', status: 'offline', shift: 'Evening' },
    { id: 4, name: 'Diana Prince', role: 'Manager', status: 'online', shift: 'Morning' },
];

export const StaffManagement: React.FC = () => {
    return (
        <ManagerLayout>
            <header className="pt-2 pb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-extrabold tracking-tight">Staff Management</h1>
                    <button className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
                        <UserPlus size={24} />
                    </button>
                </div>
                <p className="text-[#5d7f89] text-sm mt-1">Manage your team and roles</p>
            </header>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <Card className="p-4 flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400">
                        <Shield size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-[#5d7f89] uppercase">Active</p>
                        <p className="text-xl font-extrabold">3/4</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-[#5d7f89] uppercase">Shift</p>
                        <p className="text-xl font-extrabold">Morning</p>
                    </div>
                </Card>
            </div>

            {/* Staff List */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#5d7f89] uppercase tracking-widest px-1">Team Members</h3>
                {MOCK_STAFF.map(member => (
                    <Link key={member.id} to={`/staff/${member.id}`} className="block">
                        <Card className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="size-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-primary">
                                        {member.name.charAt(0)}
                                    </div>
                                    <span className={`absolute -bottom-1 -right-1 size-3 border-2 border-white dark:border-[#2d343c] rounded-full ${member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-sm">{member.name}</h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs text-[#5d7f89]">{member.role}</span>
                                        <span className="size-1 rounded-full bg-gray-300"></span>
                                        <span className="text-xs text-[#5d7f89]">{member.shift}</span>
                                    </div>
                                </div>
                                <button className="text-[#5d7f89] p-1">
                                    <Star size={18} />
                                </button>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </ManagerLayout>
    );
};
