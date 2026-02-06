import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
    User, Bell, Shield, Palette, 
    Globe, Smartphone, Save, Check 
} from 'lucide-react';

export default function Settings() {
    const { user } = useAuth();
    const [saved, setSaved] = useState(false);
    const { toggleTheme } = useAuth();

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <Layout>
            <div className="space-y-10 pb-20 max-w-5xl mx-auto">
                
                {/* 🏷️ Header */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Settings</h1>
                    <p className="text-gray-500 font-medium">Customize your financial experience.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* 👤 Profile Bento Card */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="md:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-6"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-500/10 text-purple-600 rounded-2xl">
                                <User size={24} />
                            </div>
                            <h3 className="text-xl font-bold dark:text-white uppercase tracking-tight">Public Profile</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase ml-1">Username</label>
                                <input 
                                    type="text" 
                                    defaultValue={user?.username}
                                    className="w-full p-4 bg-gray-50 dark:bg-white/5 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase ml-1">Email Address</label>
                                <input 
                                    type="email" 
                                    defaultValue={user?.email}
                                    className="w-full p-4 bg-gray-50 dark:bg-white/5 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-purple-500 outline-none transition-all opacity-60"
                                    disabled
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* 🎨 Appearance Bento Card */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-purple-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-purple-500/20 flex flex-col justify-between"
                    >
                        <div>
                            <Palette size={32} className="mb-4 opacity-80" />
                            <h3 className="text-xl font-black uppercase tracking-tight">Visuals</h3>
                            <p className="text-sm opacity-80 mt-2">Switch between Light and Dark mode vibes.</p>
                        </div>
                        <button className="mt-6 w-full py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl font-bold transition-all">
                            Toggle Aura
                        </button>
                    </motion.div>

                    {/* 🔔 Notifications Card */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-6"
                    >
                        <div className="flex items-center gap-4">
                            <Bell className="text-gray-400" />
                            <h3 className="text-lg font-bold dark:text-white uppercase tracking-tight">Alerts</h3>
                        </div>
                        <div className="space-y-4">
                            {[ 'Budget Breach', 'Weekly Report', 'Quest Complete' ].map((item) => (
                                <div key={item} className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item}</span>
                                    <div className="w-10 h-6 bg-purple-500 rounded-full relative">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* 🛡️ Privacy & Security */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="md:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm flex flex-col md:flex-row items-center gap-8"
                    >
                        <div className="p-6 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-3xl">
                            <Shield size={40} />
                        </div>
                        <div className="flex-1 space-y-2">
                            <h3 className="text-xl font-bold dark:text-white uppercase tracking-tight">Security Check</h3>
                            <p className="text-sm text-gray-500">Your data is encrypted using JWT tokens. Keep your login credentials private to maintain your financial aura.</p>
                            <button className="text-rose-500 font-black text-xs uppercase tracking-widest hover:underline pt-2">
                                Change Password
                            </button>
                        </div>
                    </motion.div>

                </div>

                {/* 💾 Fixed Save Bar */}
                <div className="flex justify-end pt-10">
                    <button 
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${
                            saved 
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                            : 'bg-black dark:bg-white dark:text-black text-white'
                        }`}
                    >
                        {saved ? <Check size={20} /> : <Save size={20} />}
                        {saved ? 'Saved' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </Layout>
    );
}