import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { Button } from '../components/Button';
import { 
    ShieldCheck, Zap, Globe, Github, 
    Cpu, LayoutTemplate, MessageSquare, Send 
} from 'lucide-react';

const About = () => {
    const [formStatus, setFormStatus] = useState('idle'); // idle, sending, success
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const techStack = [
        { name: 'Spring Boot 3', icon: <Cpu />, desc: 'Powering the logic with high-performance Java.' },
        { name: 'React 18', icon: <LayoutTemplate />, desc: 'A slick, responsive UI for the modern age.' },
        { name: 'MySQL', icon: <Database />, desc: 'Robust data integrity for your financial quests.' },
        { name: 'Framer Motion', icon: <Zap />, desc: 'Smooth-as-butter animations and transitions.' }
    ];

    const handleContact = async (e) => {
        e.preventDefault();
        setFormStatus('sending');
        
        try {
            // Replace with your actual API call: 
            // await axios.post('/api/v1/contact', formData);
            
            // Simulating API delay for the vibes
            setTimeout(() => {
                setFormStatus('success');
                setFormData({ name: '', email: '', message: '' });
            }, 1500);
        } catch (error) {
            console.error("Vibe check failed", error);
            setFormStatus('idle');
        }
    };

    return (
        <Layout>
            <div className="p-4 md:p-12 space-y-24 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-500">
                
                {/* 🌟 Hero Section */}
                <section className="text-center space-y-6 pt-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-black uppercase tracking-widest">
                            The New Standard
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mt-4 dark:text-white">
                            FINTECH <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">TRACKER</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-gray-500 text-lg md:text-xl font-medium mt-4">
                            We’re on a mission to kill "financial anxiety." Track your bread, crush your goals, and master your aura.
                        </p>
                    </motion.div>
                </section>

                {/* 🍱 Tech Stack Bento Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
                    {techStack.map((tech, i) => (
                        <motion.div
                            key={tech.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-purple-500/5 group"
                        >
                            <div className="text-purple-500 mb-4 group-hover:scale-110 transition-transform">{tech.icon}</div>
                            <h3 className="text-xl font-bold dark:text-white mb-2 uppercase tracking-tight">{tech.name}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{tech.desc}</p>
                        </motion.div>
                    ))}
                </section>

                {/* 🛡️ Values Section */}
                <section className="max-w-7xl mx-auto w-full">
                    <div className="bg-purple-600 rounded-[3.5rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-purple-500/20">
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase leading-none">Why Trust <br/>The App?</h2>
                                <div className="space-y-6">
                                    <div className="flex gap-4 items-start">
                                        <div className="p-3 bg-white/20 rounded-2xl"><ShieldCheck size={28} /></div>
                                        <div>
                                            <h4 className="font-bold text-lg">Bank-Level Logic</h4>
                                            <p className="opacity-80 text-sm">Modern JWT encryption and robust Spring Security to keep your data locked.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="p-3 bg-white/20 rounded-2xl"><Globe size={28} /></div>
                                        <div>
                                            <h4 className="font-bold text-lg">Global Standards</h4>
                                            <p className="opacity-80 text-sm">Designed for a digital-first generation of wealth builders worldwide.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center md:text-right">
                                <motion.div
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="inline-block p-10 bg-white/10 backdrop-blur-xl rounded-[3rem] border border-white/20 shadow-2xl"
                                >
                                    <p className="text-7xl font-black italic tracking-tighter">100%</p>
                                    <p className="uppercase font-black tracking-[0.3em] text-xs mt-2 opacity-80">Transparency</p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 📩 Vibe Check (Contact Form) */}
                <section className="max-w-3xl mx-auto w-full pb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <MessageSquare size={120} />
                        </div>

                        <div className="text-center mb-10 relative z-10">
                            <h2 className="text-3xl font-black tracking-tight dark:text-white uppercase">Vibe Check</h2>
                            <p className="text-gray-500 mt-2">Found a bug? Got a feature idea? Just want to say hi?</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {formStatus === 'success' ? (
                                <motion.div 
                                    key="success"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-10 space-y-4"
                                >
                                    <div className="text-7xl">🧘‍♂️</div>
                                    <h3 className="text-2xl font-black dark:text-white uppercase">Message Sent!</h3>
                                    <p className="text-gray-500">I've received your vibes. Stay tuned.</p>
                                    <Button onClick={() => setFormStatus('idle')} className="mt-4 rounded-full px-8">Send Another</Button>
                                </motion.div>
                            ) : (
                                <motion.form 
                                    key="form"
                                    onSubmit={handleContact} 
                                    className="space-y-5 relative z-10"
                                >
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="Your Name" 
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full p-5 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-purple-500 transition-all" 
                                        />
                                        <input 
                                            type="email" 
                                            placeholder="Your Email" 
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full p-5 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-purple-500 transition-all" 
                                        />
                                    </div>
                                    <textarea 
                                        placeholder="What's the word?" 
                                        rows="4" 
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        className="w-full p-5 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-[2rem] border-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    ></textarea>
                                    <button 
                                        disabled={formStatus === 'sending'}
                                        type="submit"
                                        className="w-full py-5 bg-black dark:bg-white dark:text-black text-white font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2 shadow-xl shadow-gray-200 dark:shadow-none"
                                    >
                                        {formStatus === 'sending' ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                                        ) : (
                                            <>SEND VIBES <Send size={18} /></>
                                        )}
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </section>

                {/* ✍️ Developer Credit */}
                <footer className="text-center pt-10 pb-20">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-4">Crafted with passion by</p>
                    <div className="flex justify-center gap-4">
                        <motion.a 
                            whileHover={{ scale: 1.1 }}
                            href="https://github.com/kalkerisharat" 
                            target="_blank"
                            className="flex items-center gap-2 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 hover:text-purple-500 transition-all font-bold dark:text-white"
                        >
                            <Github size={20} /> @sharat
                        </motion.a>
                    </div>
                </footer>
            </div>
        </Layout>
    );
};

// Helper component for Tech Stack (if not already defined)
const Database = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5V19A9 3 0 0 0 21 19V5"></path><path d="M3 12A9 3 0 0 0 21 12"></path></svg>
);

export default About;