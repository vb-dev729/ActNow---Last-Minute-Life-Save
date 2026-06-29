import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Apple, Flame, Scale, Plus, Trash2, Sparkles, Award, Utensils, Zap, ChevronRight 
} from 'lucide-react';

interface NutritionPageProps {
  proteinGoal: number;
  proteinConsumed: number;
  setProteinConsumed: (val: number | ((prev: number) => number)) => void;
  setHealthScore: (val: number | ((prev: number) => number)) => void;
  calories: number;
  setCalories: (val: number | ((prev: number) => number)) => void;
}

interface MealItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

export default function NutritionPage({
  proteinGoal, proteinConsumed, setProteinConsumed,
  setHealthScore, calories, setCalories
}: NutritionPageProps) {
  // Meal logs list
  const [meals, setMeals] = useState<MealItem[]>([
    { id: '1', name: 'Egg White Omelette with Avocado', calories: 340, protein: 28, carbs: 8, fats: 16, type: 'Breakfast' },
    { id: '2', name: 'Grilled Chicken Breast & Jasmine Rice', calories: 580, protein: 44, carbs: 45, fats: 8, type: 'Lunch' }
  ]);

  // Add meal form state
  const [newMealName, setNewMealName] = useState('');
  const [newMealCal, setNewMealCal] = useState(300);
  const [newMealProt, setNewMealProt] = useState(25);
  const [newMealType, setNewMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Lunch');

  const addMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMealName.trim()) return;

    const meal: MealItem = {
      id: `meal-${Date.now()}`,
      name: newMealName,
      calories: newMealCal,
      protein: newMealProt,
      carbs: Math.round(newMealCal * 0.4 / 4), // estimation for carbs
      fats: Math.round(newMealCal * 0.3 / 9),  // estimation for fats
      type: newMealType
    };

    const updated = [...meals, meal];
    setMeals(updated);
    setCalories(prev => prev + meal.calories);
    setProteinConsumed(prev => prev + meal.protein);
    setHealthScore(prev => Math.min(100, prev + 2));

    setNewMealName('');
    setNewMealCal(300);
    setNewMealProt(25);
  };

  const deleteMeal = (id: string) => {
    const target = meals.find(m => m.id === id);
    if (!target) return;
    setMeals(meals.filter(m => m.id !== id));
    setCalories(prev => Math.max(0, prev - target.calories));
    setProteinConsumed(prev => Math.max(0, prev - target.protein));
  };

  // Computations
  const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = meals.reduce((acc, m) => acc + m.protein, 0);
  const totalCarbs = meals.reduce((acc, m) => acc + m.carbs, 0);
  const totalFats = meals.reduce((acc, m) => acc + m.fats, 0);

  const calGoal = 2400;

  return (
    <div className="min-h-screen bg-[#030712] text-white p-6 md:p-8 space-y-8" id="nutrition-page">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">METABOLIC MACRONUTRIENT RADAR</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase font-sans">
            Nutrition & Diet
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Track amino-acid buffers, metabolic thermo-indexes, calorie pools, and dynamic macronutrient partitions in real-time.
          </p>
        </div>

        {/* Global Protein Meter */}
        <div className="bg-gradient-to-br from-amber-500/10 to-rose-500/10 border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <Apple className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Protein Synthesis</span>
            <span className="text-sm font-extrabold text-amber-400 font-mono">
              {totalProtein}g / {proteinGoal}g Consumed
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Diet Logs & Adder */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Add Meal Form Card */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/10 transition-all duration-500" />
            
            <div className="flex items-center gap-3 mb-6">
              <Utensils className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Metabolic Meal Logger</h3>
                <span className="text-[10px] text-gray-400 font-semibold font-mono">TRACK CALORIC & MACRO INFLOWS</span>
              </div>
            </div>

            <form onSubmit={addMeal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Meal / Food Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Avocado Toast with Egg"
                    value={newMealName}
                    onChange={(e) => setNewMealName(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Meal Category</label>
                  <select
                    value={newMealType}
                    onChange={(e: any) => setNewMealType(e.target.value)}
                    className="w-full bg-[#05060d] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <span>Est. Calories</span>
                    <span className="text-amber-400 font-mono">{newMealCal} kcal</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="1200" 
                    step="25"
                    value={newMealCal}
                    onChange={(e) => setNewMealCal(parseInt(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <span>Protein Weight</span>
                    <span className="text-amber-400 font-mono">{newMealProt}g</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="1"
                    value={newMealProt}
                    onChange={(e) => setNewMealProt(parseInt(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Log Food Intake</span>
              </button>
            </form>
          </div>

          {/* Active Food Log Table */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6">
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">Logged Intake Today</h4>
            <div className="space-y-2.5">
              <AnimatePresence initial={false}>
                {meals.map((m) => (
                  <motion.div 
                    key={m.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-between p-3 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-xl text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded uppercase">
                        {m.type}
                      </span>
                      <div>
                        <span className="font-bold text-white block">{m.name}</span>
                        <span className="text-[10px] text-gray-500 font-semibold font-mono">
                          Prot: {m.protein}g • Carbs: {m.carbs}g • Fats: {m.fats}g
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono text-amber-400 font-extrabold">{m.calories} kcal</span>
                      <button 
                        onClick={() => deleteMeal(m.id)}
                        className="text-gray-500 hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {meals.length === 0 && (
                <div className="text-center py-6 text-xs text-gray-500 font-semibold">
                  No food items logged for today yet. Use the logger above to begin.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Macronutrient breakdown & dynamic diet coach */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Macronutrient Dial / Progress Bars */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Scale className="w-4 h-4 text-rose-400" />
              <span>Nutrient Allocation Partition</span>
            </h4>

            <div className="space-y-4">
              {/* Calories Pool */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                  <span>Total Calories Pool:</span>
                  <span className="text-amber-400 font-mono">{totalCalories} / {calGoal} kcal</span>
                </div>
                <div className="h-2 bg-white/[0.03] border border-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                    style={{ width: `${Math.min(100, (totalCalories / calGoal) * 100)}%` }}
                    animate={{ width: `${Math.min(100, (totalCalories / calGoal) * 100)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              {/* Protein Allocation */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                  <span>Amino Acids (Protein):</span>
                  <span className="text-emerald-400 font-mono">{totalProtein} / {proteinGoal}g</span>
                </div>
                <div className="h-2 bg-white/[0.03] border border-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    style={{ width: `${Math.min(100, (totalProtein / proteinGoal) * 100)}%` }}
                    animate={{ width: `${Math.min(100, (totalProtein / proteinGoal) * 100)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              {/* Carbohydrates */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                  <span>Glycogen Refill (Carbs):</span>
                  <span className="text-blue-400 font-mono">{totalCarbs}g / 220g</span>
                </div>
                <div className="h-2 bg-white/[0.03] border border-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    style={{ width: `${Math.min(100, (totalCarbs / 220) * 100)}%` }}
                    animate={{ width: `${Math.min(100, (totalCarbs / 220) * 100)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              {/* Fats */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                  <span>Hormonal Buffer (Lipids/Fats):</span>
                  <span className="text-indigo-400 font-mono">{totalFats}g / 75g</span>
                </div>
                <div className="h-2 bg-white/[0.03] border border-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                    style={{ width: `${Math.min(100, (totalFats / 75) * 100)}%` }}
                    animate={{ width: `${Math.min(100, (totalFats / 75) * 100)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic AI Diet Advice */}
          <div className="bg-[#090b14] border border-white/5 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">AI Dietetics Assistant</h4>
            </div>
            <p className="text-xs text-gray-300 font-medium leading-relaxed mb-4">
              Your protein intake is currently at <span className="text-emerald-400 font-bold">{Math.round((totalProtein / proteinGoal) * 100)}%</span> of your muscle conservation threshold. Since you registered a workout today, try loading up an additional 25g of protein within 2 hours.
            </p>
            <div className="p-3 bg-amber-950/20 border border-amber-500/10 rounded-xl flex items-start gap-2.5">
              <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest block">NUTRITIONAL CRITERIA MET</span>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5 leading-relaxed">
                  Excellent focus on whole-food nutrient integrity. Keep sodium intake low to support pulse levels.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
