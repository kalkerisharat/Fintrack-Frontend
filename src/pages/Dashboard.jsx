import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../services/dashboardService';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    Tooltip as RechartsTooltip,
    AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Zap, Sparkles, LogOut } from 'lucide-react';

// Gen-Z Neon Palette
const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#6366F1'];

export default function Dashboard() {
    const { user, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        totalExpenses: 0,
        totalIncome: 0,
        expensesByCategory: [],
        monthlyHistory: []
    });

    useEffect(() => {
        if (!authLoading && !user) navigate('/login');
    }, [authLoading, user, navigate]);

    useEffect(() => {
        if (authLoading || !user) return;
        const fetchData = async () => {
            try {
                setLoading(true);
                const date = new Date();
                const month = date.toLocaleString('default', { month: 'long' }).toUpperCase();
                const year = date.getFullYear();

                const [expenses, income, categoryData, history] = await Promise.all([
                    dashboardService.getTotalExpenses(month, year),
                    dashboardService.getTotalIncome(month, year),
                    dashboardService.getExpensesByCategory(month, year),
                    dashboardService.getMonthlyHistory()
                ]);

                setData({
                    totalExpenses: expenses,
                    totalIncome: income,
                    expensesByCategory: Object.entries(categoryData || {}).map(([name, value]) => ({ name, value })),
                    monthlyHistory: Object.keys({ ...history?.monthlyExpenses, ...history?.monthlyIncomes })
                        .sort().map(key => ({
                            name: key,
                            expense: history.monthlyExpenses?.[key] || 0,
                            income: history.monthlyIncomes?.[key] || 0
                        }))
                });
            } catch (error) {
                console.error(error);
                if (error.response?.status === 401) { logout(); navigate('/login'); }
            } finally { setLoading(false); }
        };
        fetchData();
    }, [authLoading, user, navigate, logout]);

    const formatCurrency = (amount) => 
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black">
                <motion.div 
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="h-16 w-16 border-t-4 border-purple-500 rounded-full"
                />
                <p className="text-purple-400 mt-4 font-mono tracking-widest animate-pulse">LOADING_VIBES...</p>
            </div>
        );
    }

    return (
        <Layout>
            <div className="p-4 md:p-8 space-y-10 bg-white dark:bg-gray-950 min-h-screen transition-colors duration-500">
                
                {/* ✨ Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <motion.div 
                        initial={{ x: -50, opacity: 0 }} 
                        animate={{ x: 0, opacity: 1 }}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="text-purple-500 h-5 w-5" />
                            <span className="text-xs font-bold uppercase tracking-widest text-purple-500">Financial Aura</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                            Sup, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                                {user?.username || user?.email?.split('@')[0]}
                            </span>?
                        </h1>
                    </motion.div>
                    
                    <Button 
                        onClick={() => { logout(); navigate('/login'); }}
                        className="rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-500 dark:hover:bg-red-600 group transition-all"
                    >
                        <LogOut className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                        Log Out
                    </Button>
                </header>

                {/* 💳 Visual Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: 'Income', val: data.totalIncome, color: 'from-emerald-400 to-cyan-500', icon: TrendingUp },
                        { label: 'Spent', val: data.totalExpenses, color: 'from-rose-400 to-orange-500', icon: TrendingDown },
                        { label: 'Aura Points (Balance)', val: data.totalIncome - data.totalExpenses, color: 'from-purple-500 to-indigo-600', icon: Zap }
                    ].map((card, i) => (
                        <motion.div
                            key={card.label}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className={`relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br ${card.color} text-white shadow-xl shadow-purple-500/10`}
                        >
                            <card.icon className="absolute -right-4 -bottom-4 h-32 w-32 opacity-20 rotate-12" />
                            <p className="uppercase text-xs font-bold tracking-widest opacity-80 mb-1">{card.label}</p>
                            <p className="text-4xl font-black">{formatCurrency(card.val)}</p>
                        </motion.div>
                    ))}
                </div>

                {/* 📈 Big Energy Chart Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Expense Flow */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.5rem] shadow-sm"
                    >
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <TrendingUp className="text-purple-500" /> Cashflow Check
                        </h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.monthlyHistory}>
                                    <defs>
                                        <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                                    <YAxis hide />
                                    <RechartsTooltip 
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="income" stroke="#8B5CF6" strokeWidth={4} fillOpacity={1} fill="url(#colorInc)" />
                                    <Area type="monotone" dataKey="expense" stroke="#EC4899" strokeWidth={4} fillOpacity={0} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Category Vibes */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.5rem] shadow-sm"
                    >
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Wallet className="text-pink-500" /> Spending Distribution
                        </h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.expensesByCategory}
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {data.expensesByCategory.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                </div>
            </div>
        </Layout>
    );
}