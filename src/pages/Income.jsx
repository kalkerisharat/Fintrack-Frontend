import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import TransactionForm from '../components/TransactionForm';
import incomeService from '../services/incomeService';
import { 
    Plus, Search, Filter, Trash2, Edit2, 
    Calendar, TrendingUp, DollarSign, Sparkles, ArrowRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INCOME_CATEGORIES = [
    'SALARY', 'BUSINESS', 'FREELANCE', 'INVESTMENT', 'GIFT', 'OTHER'
];

export default function Income() {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingIncome, setEditingIncome] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');

    useEffect(() => {
        fetchIncomes();
    }, []);

    const fetchIncomes = async () => {
        try {
            setLoading(true);
            const data = await incomeService.getAll();
            const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setIncomes(sorted);
        } catch (error) {
            console.error("Failed to fetch income", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Stats Calculations ---
    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const highestIncome = incomes.length > 0 ? Math.max(...incomes.map(i => i.amount)) : 0;
    const recentIncome = incomes.length > 0 ? incomes[0].amount : 0;

    // 🔥 RESTORED: handleAdd and handleEdit
    const handleAdd = async (formData) => {
        try {
            await incomeService.add(formData);
            fetchIncomes();
            setIsFormOpen(false);
        } catch (error) {
            console.error("Failed to add income", error);
        }
    };

    const handleEdit = async (formData) => {
        try {
            await incomeService.update(editingIncome.id, formData);
            fetchIncomes();
            setIsFormOpen(false);
            setEditingIncome(null);
        } catch (error) {
            console.error("Failed to update income", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this entry from the bag?')) {
            try {
                await incomeService.delete(id);
                fetchIncomes();
            } catch (error) {
                console.error("Failed to delete income", error);
            }
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD',
            maximumFractionDigits: 0 
        }).format(amount);
    };

    const filteredIncomes = incomes.filter(income => {
        const matchesSearch = income.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            income.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'ALL' || income.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
    <Layout>
        <div className="space-y-6 md:space-y-10 pb-24">
            
            {/* ✨ Responsive Header & Stats */}
            <div className="flex flex-col gap-6 md:gap-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="text-emerald-500 h-4 w-4" />
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">Revenue Stream</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Income Hub</h1>
                    </motion.div>
                    
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setEditingIncome(null); setIsFormOpen(true); }}
                        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-4 rounded-2xl font-black flex justify-center items-center gap-2 shadow-lg transition-all"
                    >
                        <Plus className="w-5 h-5" /> ADD TO BAG
                    </motion.button>
                </div>

                {/* Bento Stats Grid - Stacks on Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    <motion.div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 md:p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
                        <TrendingUp className="absolute -right-4 -bottom-4 h-20 w-20 opacity-20 rotate-12" />
                        <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Total Revenue</p>
                        <h2 className="text-3xl md:text-4xl font-black">{formatCurrency(totalIncome)}</h2>
                    </motion.div>

                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 p-6 md:p-8 rounded-[2rem] shadow-sm">
                        <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Biggest Hit</p>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">{formatCurrency(highestIncome)}</h2>
                    </div>

                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 p-6 md:p-8 rounded-[2rem] shadow-sm sm:col-span-2 md:col-span-1">
                        <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Latest Drop</p>
                        <h2 className="text-2xl md:text-3xl font-black text-emerald-500">{formatCurrency(recentIncome)}</h2>
                    </div>
                </div>
            </div>

            {/* 🔍 Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Find specific drops..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-gray-900 border-none ring-1 ring-gray-100 dark:ring-white/5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white text-sm"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full md:w-auto px-6 py-4 rounded-2xl bg-white dark:bg-gray-900 border-none ring-1 ring-gray-100 dark:ring-white/5 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-sm dark:text-white"
                >
                    <option value="ALL">ALL CATEGORIES</option>
                    {INCOME_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

            {/* 📝 Responsive Income List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="p-20 text-center font-bold text-gray-400 animate-pulse uppercase tracking-widest">Syncing_The_Bag...</div>
                ) : filteredIncomes.length === 0 ? (
                    <div className="p-10 bg-white dark:bg-gray-900 rounded-[2rem] text-center border border-dashed border-gray-200 dark:border-white/10">
                        <h3 className="text-lg font-bold dark:text-white uppercase mb-1">No Bag Detected</h3>
                        <p className="text-gray-500 text-sm">Time to secure some income, bestie.</p>
                    </div>
                ) : (
                    <>
                        {/* 📱 MOBILE VIEW: Cards (Hidden on Desktop) */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {filteredIncomes.map((income) => (
                                <motion.div 
                                    layout
                                    key={income.id}
                                    className="p-5 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="px-2 py-1 rounded-lg text-[10px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 uppercase">
                                            {income.category}
                                        </span>
                                        <div className="flex gap-1">
                                            <button onClick={() => { setEditingIncome(income); setIsFormOpen(true); }} className="p-2 text-gray-400"><Edit2 size={16}/></button>
                                            <button onClick={() => handleDelete(income.id)} className="p-2 text-gray-400"><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-4">
                                        {income.description || 'Generic Drop'}
                                    </h3>
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold">
                                            <Calendar size={12}/> {new Date(income.date).toLocaleDateString()}
                                        </div>
                                        <span className="text-xl font-black text-emerald-600 dark:text-emerald-500">
                                            {formatCurrency(income.amount)}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* 💻 DESKTOP VIEW: Table (Hidden on Mobile) */}
                        <div className="hidden md:block bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="border-b border-gray-50 dark:border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                    <tr>
                                        <th className="px-8 py-6">Date</th>
                                        <th className="px-8 py-6">Source</th>
                                        <th className="px-8 py-6">Description</th>
                                        <th className="px-8 py-6 text-right">Amount</th>
                                        <th className="px-8 py-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                    {filteredIncomes.map((income) => (
                                        <tr key={income.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-8 py-6 text-sm text-gray-500">{new Date(income.date).toLocaleDateString()}</td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 rounded-lg text-[10px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 uppercase">
                                                    {income.category}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{income.description || 'Generic Drop'}</td>
                                            <td className="px-8 py-6 text-right font-black text-emerald-600 dark:text-emerald-500">{formatCurrency(income.amount)}</td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => { setEditingIncome(income); setIsFormOpen(true); }} className="p-2 hover:text-blue-500"><Edit2 size={16}/></button>
                                                    <button onClick={() => handleDelete(income.id)} className="p-2 hover:text-red-500"><Trash2 size={16}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            <TransactionForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={editingIncome ? handleEdit : handleAdd}
                initialData={editingIncome}
                type="Income"
                categories={INCOME_CATEGORIES}
            />
        </div>
    </Layout>
);
}