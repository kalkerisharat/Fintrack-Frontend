import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import TransactionForm from '../components/TransactionForm';
import expenseService from '../services/expenseService';
import { 
    Plus, Search, Filter, Trash2, Edit2, 
    Calendar, TrendingDown, Receipt, Sparkles, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EXPENSE_CATEGORIES = [
    'FOOD', 'TRANSPORT', 'UTILITIES', 'ENTERTAINMENT', 'HEALTH', 'EDUCATION', 'SHOPPING', 'OTHER'
];

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const data = await expenseService.getAll();
            const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setExpenses(sorted);
        } catch (error) {
            console.error("Failed to fetch expenses", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Stats Calculations ---
    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
    const topCategory = expenses.length > 0 
        ? Object.entries(expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
          }, {})).sort((a, b) => b[1] - a[1])[0][0]
        : 'NONE';

    const handleAdd = async (formData) => {
        try {
            await expenseService.add(formData);
            fetchExpenses();
            setIsFormOpen(false);
        } catch (error) {
            alert(`Server Error: ${error.response?.data?.message || "Check category lengths!"}`);
        }
    };

    const handleEdit = async (formData) => {
        try {
            await expenseService.update(editingExpense.id, formData);
            fetchExpenses();
            setIsFormOpen(false);
            setEditingExpense(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this record? It will affect your aura.')) {
            try {
                await expenseService.delete(id);
                fetchExpenses();
            } catch (error) {
                console.error(error);
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

    const filteredExpenses = expenses.filter(expense => {
        const matchesSearch = expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            expense.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'ALL' || expense.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <Layout>
            <div className="space-y-10 pb-20">
                
                {/* ✨ Elite Header & Stats */}
                <div className="flex flex-col gap-8">
                    <div className="flex justify-between items-end">
                        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="text-rose-500 h-4 w-4" />
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">Burn Rate</span>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Expense Log</h1>
                        </motion.div>
                        
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { setEditingExpense(null); setIsFormOpen(true); }}
                            className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all"
                        >
                            <Plus className="w-5 h-5" /> LOG SPEND
                        </motion.button>
                    </div>

                    {/* Bento Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-rose-500 to-orange-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-rose-500/10 relative overflow-hidden">
                            <TrendingDown className="absolute -right-4 -bottom-4 h-24 w-24 opacity-20 rotate-12" />
                            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Total Outflow</p>
                            <h2 className="text-4xl font-black">{formatCurrency(totalSpent)}</h2>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 p-8 rounded-[2.5rem] shadow-sm">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Heavy Hitter</p>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{topCategory}</h2>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 p-8 rounded-[2.5rem] shadow-sm">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Count</p>
                            <h2 className="text-3xl font-black text-rose-500 tracking-tighter">{expenses.length} Entries</h2>
                        </motion.div>
                    </div>
                </div>

                {/* 🔍 Search & Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by vendor or vibes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-gray-900 border-none ring-1 ring-gray-100 dark:ring-white/5 focus:ring-2 focus:ring-rose-500 outline-none transition-all dark:text-white"
                        />
                    </div>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-6 py-4 rounded-2xl bg-white dark:bg-gray-900 border-none ring-1 ring-gray-100 dark:ring-white/5 focus:ring-2 focus:ring-rose-500 outline-none font-bold text-xs dark:text-white uppercase tracking-widest"
                    >
                        <option value="ALL">ALL CATEGORIES</option>
                        {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                {/* 📝 Modern Transaction Cards */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="p-20 text-center font-bold text-gray-400 animate-pulse tracking-widest uppercase">Fetching_Data...</div>
                    ) : filteredExpenses.length === 0 ? (
                        <div className="p-20 text-center bg-white dark:bg-gray-900 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-800">
                            <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold dark:text-white uppercase mb-2">Clean Ledger</h3>
                            <p className="text-gray-500">No expenses found matching those filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            <AnimatePresence>
                                {filteredExpenses.map((expense) => (
                                    <motion.div
                                        key={expense.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="group bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-rose-500/5 transition-all flex flex-col sm:flex-row justify-between items-center gap-6"
                                    >
                                        <div className="flex items-center gap-6 w-full">
                                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-rose-500 font-black text-center min-w-[70px]">
                                                <span className="block text-[10px] uppercase opacity-60">
                                                    {new Date(expense.date).toLocaleString('default', { month: 'short' })}
                                                </span>
                                                <span className="text-xl">
                                                    {new Date(expense.date).getDate()}
                                                </span>
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <span className="inline-block px-2 py-0.5 rounded-lg text-[10px] font-black bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 uppercase tracking-tighter mb-1">
                                                    {expense.category}
                                                </span>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate uppercase tracking-tight">
                                                    {expense.description || 'Misc Spend'}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                                            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                                                -{formatCurrency(expense.amount)}
                                            </span>
                                            
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEditModal(expense)} className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(expense.id)} className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                <TransactionForm
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={editingExpense ? handleEdit : handleAdd}
                    initialData={editingExpense}
                    type="Expense"
                    categories={EXPENSE_CATEGORIES}
                />
            </div>
        </Layout>
    );
}