import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, Wallet, TrendingUp, TrendingDown, 
    LogOut, Target, Info, Sun, Moon, Settings, Menu, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
    const { user, logout, isDarkMode, toggleTheme } = useAuth(); 
    const location = useLocation();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/expenses', label: 'Expenses', icon: TrendingDown },
        { path: '/income', label: 'Income', icon: TrendingUp },
        { path: '/goals', label: 'Quests', icon: Target },
        { path: '/about', label: 'About', icon: Info },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'dark' : ''}`}>
            <div className="flex w-full bg-gray-50 dark:bg-black transition-colors duration-500">
                
                {/* 🌌 Desktop Sidebar (Hidden on Mobile) */}
                <aside className="w-72 bg-white/80 dark:bg-gray-950/50 backdrop-blur-xl border-r border-gray-200 dark:border-white/10 hidden md:flex flex-col fixed h-full z-30">
                    <div className="p-8 flex items-center gap-3">
                        <motion.div whileHover={{ rotate: 180 }} className="bg-gradient-to-tr from-purple-600 to-pink-500 p-2.5 rounded-2xl shadow-lg shadow-purple-500/30">
                            <Wallet className="w-6 h-6 text-white" />
                        </motion.div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">FinTrack</span>
                            <span className="text-[10px] font-bold text-purple-500 tracking-[0.2em] uppercase opacity-80">v2.0 Beta</span>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link key={item.path} to={item.path} className="relative group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300">
                                    {isActive && (
                                        <motion.div layoutId="nav-glow" className="absolute inset-0 bg-purple-500/10 dark:bg-purple-500/20 z-0" />
                                    )}
                                    <Icon className={`w-5 h-5 z-10 ${isActive ? 'text-purple-500' : 'text-gray-400'}`} />
                                    <span className={`text-sm z-10 ${isActive ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-gray-500'}`}>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Card */}
                    <div className="p-6 border-t border-gray-100 dark:border-white/5 space-y-4">
                        <div className="flex items-center gap-2">
                            <button onClick={toggleTheme} className="flex-1 flex items-center justify-center p-3 bg-gray-100/50 dark:bg-white/5 rounded-2xl text-gray-500 dark:text-gray-400">
                                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                            <button onClick={handleLogout} className="flex-1 flex items-center justify-center p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-2xl">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* 📱 Mobile Header */}
                <header className="md:hidden fixed top-0 w-full bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg border-b border-gray-100 dark:border-white/5 z-40 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-purple-600 p-2 rounded-xl"><Wallet className="w-5 h-5 text-white" /></div>
                        <span className="text-xl font-black tracking-tighter dark:text-white uppercase">FinTrack</span>
                    </div>
                    <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </header>

                {/* 📱 Mobile Bottom Navigation (Visible only on Mobile) */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 z-50 px-6 py-3 flex justify-between items-center">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1">
                                <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-purple-500/10 text-purple-500' : 'text-gray-400'}`}>
                                    <Icon size={20} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-tighter ${isActive ? 'text-purple-500' : 'text-gray-400'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* 🏠 Main Content */}
                <main className="flex-1 md:ml-72 min-h-screen relative pb-24 md:pb-0">
                    <div className="p-6 md:p-10 pt-24 md:pt-10">
                        <AnimatePresence mode="wait">
                            <motion.div key={location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
}