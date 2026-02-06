import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, Wallet, TrendingUp, TrendingDown, 
    LogOut, Target, Info, Sun, Moon, Sparkles, Settings 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
    // Get everything from AuthContext
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'dark' : ''}`}>
            <div className="flex w-full bg-gray-50 dark:bg-black transition-colors duration-500">
                
                {/* 🌌 Sidebar */}
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
                                <Link key={item.path} to={item.path} className="relative group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 overflow-hidden">
                                    {isActive && (
                                        <motion.div layoutId="nav-glow" className="absolute inset-0 bg-purple-500/10 dark:bg-purple-500/20 z-0" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                                    )}
                                    <Icon className={`w-5 h-5 z-10 ${isActive ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`} />
                                    <span className={`text-sm z-10 ${isActive ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-gray-500 dark:text-gray-400 font-medium'}`}>{item.label}</span>
                                    {isActive && <motion.div layoutId="active-dot" className="absolute left-0 w-1.5 h-6 bg-purple-500 rounded-r-full" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* 🌓 User Card & Toggles */}
                    <div className="p-6 border-t border-gray-100 dark:border-white/5 space-y-4" ref={menuRef}>
                        <AnimatePresence>
                            {isUserMenuOpen && (
                                <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-32 left-6 right-6 bg-white/90 dark:bg-gray-900/90 border border-gray-100 dark:border-white/10 rounded-[2rem] shadow-2xl p-3 z-50 backdrop-blur-2xl">
                                    <button onClick={() => { navigate('/settings'); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-all">
                                        <Settings size={18} /> Account Settings
                                    </button>
                                    <div className="h-px bg-gray-100 dark:bg-white/5 my-1" />
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all">
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div 
                            whileTap={{ scale: 0.96 }} 
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                            className={`flex items-center gap-3 p-3 rounded-[1.5rem] border transition-all cursor-pointer ${isUserMenuOpen ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-500/30' : 'bg-gray-100/50 dark:bg-white/5 border-transparent hover:border-white/10'}`}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-black shadow-lg">
                                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-950 rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-gray-900 dark:text-white truncate uppercase tracking-tighter">{user?.username || 'User'}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-60">Pro Member</p>
                            </div>
                        </motion.div>

                        <div className="flex items-center gap-2">
                            {/* 🔥 FIXED: Now using toggleTheme from Context */}
                            <button 
                                onClick={toggleTheme} 
                                className="flex-1 flex items-center justify-center p-3 bg-gray-100/50 dark:bg-white/5 rounded-2xl text-gray-500 dark:text-gray-400 hover:text-purple-500 transition-colors"
                            >
                                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                            <button onClick={handleLogout} className="flex-1 flex items-center justify-center p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </aside>

                <header className="md:hidden fixed top-0 w-full bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg border-b border-gray-100 dark:border-white/5 z-40 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-purple-600 p-2 rounded-xl"><Wallet className="w-5 h-5 text-white" /></div>
                        <span className="text-xl font-black tracking-tighter dark:text-white uppercase">FinTrack</span>
                    </div>
                </header>

                <main className="flex-1 md:ml-72 min-h-screen relative">
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