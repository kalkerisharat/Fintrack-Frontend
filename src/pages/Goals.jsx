import React, { useState, useEffect } from 'react';
import { goalsService } from '../services/goalsService';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Calendar, ChevronRight, X } from 'lucide-react';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', deadline: '' });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await goalsService.getAll();
      setGoals(data);
    } catch (err) {
      console.error("Failed to fetch goals", err);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      // Ensure targetAmount is a number
      await goalsService.create({
        ...newGoal,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: 0
      });
      setIsModalOpen(false); // Close modal
      setNewGoal({ name: '', targetAmount: '', deadline: '' }); // Reset form
      fetchGoals(); // Refresh list
    } catch (err) {
      console.error("Creation failed", err);
    }
  };

  const handleAddFunds = async (id) => {
    const amount = prompt("🚀 How much we dropping today?");
    if (amount && !isNaN(amount)) {
      await goalsService.addFunds(id, parseFloat(amount));
      fetchGoals();
    }
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100).toFixed(0);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* --- HEADER AREA --- */}
      <div className="flex justify-between items-end">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">
            SAVINGS <span className="text-purple-500">QUESTS</span>
          </h2>
          <p className="text-gray-500 font-medium">Locked in on your targets.</p>
        </motion.div>
        
        <motion.button 
          onClick={() => setIsModalOpen(true)} // Now functional
          whileHover={{ scale: 1.05, rotate: 1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-2xl shadow-lg shadow-purple-500/20 flex items-center gap-2 font-bold"
        >
          <Plus size={20} /> New Goal
        </motion.button>
      </div>

      {/* --- BENTO GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {goals.map((goal, index) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 hover:border-purple-500/50 transition-all shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />

                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl text-purple-600 dark:text-purple-400">
                    <Target size={24} />
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-purple-500 uppercase tracking-widest">
                      {progress}% Charged
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1 uppercase tracking-tight">{goal.name}</h3>
                
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                  <Calendar size={14} />
                  <span>Ends {new Date(goal.deadline).toLocaleDateString()}</span>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs font-bold dark:text-gray-400">
                    <span>${goal.currentAmount.toLocaleString()}</span>
                    <span>${goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-4 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                  </div>
                </div>

                <motion.button 
                  whileHover={{ x: 5 }}
                  onClick={() => handleAddFunds(goal.id)}
                  className="w-full py-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-purple-600 group-hover:text-white transition-colors"
                >
                  Fuel Up <ChevronRight size={18} />
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* --- CREATE GOAL MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X size={24} />
              </button>

              <h3 className="text-3xl font-black mb-6 dark:text-white tracking-tighter">NEW QUEST</h3>
              
              <form onSubmit={handleCreateGoal} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-2 block">Quest Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dream PC, Japan Trip"
                    className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 dark:text-white border-none focus:ring-2 focus:ring-purple-500"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-2 block">Target Bag ($)</label>
                  <input 
                    type="number" 
                    placeholder="5000"
                    className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 dark:text-white border-none focus:ring-2 focus:ring-purple-500"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-2 block">Deadline</label>
                  <input 
                    type="date" 
                    className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 dark:text-white border-none focus:ring-2 focus:ring-purple-500"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 mt-4 bg-purple-600 text-white rounded-2xl font-black shadow-lg shadow-purple-500/40 hover:bg-purple-500 transition-all"
                >
                  START QUEST
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Goals;