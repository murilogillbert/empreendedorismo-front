import React from 'react';
import { ChevronLeft, Search, Book, Video, MessageCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ManagerLayout } from '@/components/ManagerLayout';
import { Card } from '@/components/ui/Card';

export const HelpCenter: React.FC = () => {
    const navigate = useNavigate();

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
                    <h1 className="text-xl font-extrabold tracking-tight">Help & Support</h1>
                    <p className="text-[#5d7f89] text-xs">Find answers and guides</p>
                </div>
            </header>

            <div className="space-y-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5d7f89]" size={18} />
                    <input
                        type="text"
                        placeholder="How can we help?"
                        className="w-full bg-white dark:bg-[#2d343c] border border-gray-100 dark:border-gray-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                </div>

                <section className="grid grid-cols-2 gap-3">
                    <HelpCard icon={<Book className="text-blue-500" />} label="Guides" />
                    <HelpCard icon={<Video className="text-purple-500" />} label="Tutorials" />
                    <HelpCard icon={<MessageCircle className="text-green-500" />} label="Support" />
                    <HelpCard icon={<FileText className="text-orange-500" />} label="Docs" />
                </section>

                <section className="space-y-4">
                    <h3 className="text-xs font-bold text-[#5d7f89] uppercase tracking-widest px-1">Common Topics</h3>
                    <div className="space-y-3">
                        <FaqItem question="How to setup digital payments?" />
                        <FaqItem question="Changing staff permissions" />
                        <FaqItem question="Updating menu prices via CSV" />
                    </div>
                </section>
            </div>
        </ManagerLayout>
    );
};

const HelpCard = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <Card className="flex flex-col items-center gap-2 py-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#353c45] transition-colors">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">{icon}</div>
        <span className="text-xs font-extrabold">{label}</span>
    </Card>
);

const FaqItem = ({ question }: { question: string }) => (
    <Card className="p-4 flex justify-between items-center cursor-pointer">
        <span className="text-xs font-bold">{question}</span>
        <ChevronLeft size={16} className="rotate-180 text-gray-300" />
    </Card>
);
