import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Briefcase, 
  Home, 
  Car, 
  TrendingUp, 
  ShoppingBag, 
  Heart, 
  Smile, 
  Skull, 
  Calendar,
  DollarSign,
  GraduationCap,
  Users,
  Dog,
  Film,
  Zap
} from 'lucide-react';
import { EducationLevel, Job, Asset, GameState, Relationship } from './types';
import { JOBS, HOUSES, CARS, PETS, ENTERTAINMENT, RANDOM_NAMES } from './constants';

const createInitialState = (name: string = ''): GameState => ({
  name,
  age: 18,
  money: 2000,
  happiness: 80,
  health: 100,
  fitness: 50,
  smarts: Math.floor(Math.random() * 60) + 20,
  looks: Math.floor(Math.random() * 60) + 20,
  education: EducationLevel.HighSchool,
  currentJob: null,
  yearsAtCurrentJob: 0,
  jobPerformance: 50,
  assets: [],
  relationships: [
    { id: 'f1', name: 'Mom', type: 'Family', closeness: 90 },
    { id: 'f2', name: 'Dad', type: 'Family', closeness: 85 },
    { id: 'fr1', name: RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)], type: 'Friend', closeness: 60 },
  ],
  log: ['You just graduated high school with $2,000. Life is brutal and expensive. Survival is the first goal.'],
  isDead: false,
  yearlyExpenses: 36000,
});

export default function App() {
  const [state, setState] = useState<GameState>(createInitialState());
  const [activeTab, setActiveTab] = useState<'life' | 'job' | 'assets' | 'social' | 'activities' | 'shop'>('life');
  const [isNamingScreen, setIsNamingScreen] = useState(true);
  const [nameInput, setNameInput] = useState('');

  const monthlyIncome = state.currentJob ? state.currentJob.salary / 12 : 0;
  
  // Tax calculation
  const calculateTax = (annualSalary: number) => {
    if (annualSalary <= 30000) return annualSalary * 0.20; // 20% for entry level
    if (annualSalary <= 100000) return 6000 + (annualSalary - 30000) * 0.40; // 40% for middle
    return 34000 + (annualSalary - 100000) * 0.60; // 60% for high earners
  };

  const annualTax = state.currentJob ? calculateTax(state.currentJob.salary) : 0;
  const monthlyExpenses = (state.yearlyExpenses / 12) + (annualTax / 12) + state.assets.reduce((acc, curr) => acc + curr.monthlyCost, 0);

  const addLog = (message: string) => {
    setState(prev => ({
      ...prev,
      log: [message, ...prev.log].slice(0, 50)
    }));
  };

  const handleAgeUp = () => {
    if (state.isDead) return;

    setState(prev => {
      const newAge = prev.age + 1;
      const salary = prev.currentJob?.salary || 0;
      const tax = calculateTax(salary);
      const maintenance = prev.assets.reduce((acc, curr) => acc + curr.monthlyCost * 12, 0);
      const netYearly = salary - (prev.yearlyExpenses + maintenance + tax);
      const newMoney = prev.money + netYearly;
      
      let newHealth = prev.health - (Math.random() * (prev.age / 8));
      let newFitness = prev.fitness - (Math.random() * (prev.age / 10)) - 2; // Natural decay
      let newHappiness = prev.happiness - (prev.currentJob?.stress || 0) / 10 + (prev.assets.length * 1.5);
      
      const newLogs = [...prev.log];
      newLogs.unshift(`Year ${newAge}: A new year begins!`);

      // Experience tracking
      const newYearsAtJob = prev.currentJob ? prev.yearsAtCurrentJob + 1 : 0;
      
      // Job performance decay
      let performanceDecay = 5;
      if (salary > 100000) performanceDecay = 8;
      if (salary > 500000) performanceDecay = 12;
      if (salary > 1000000) performanceDecay = 20;

      let newPerformance = prev.currentJob ? Math.max(0, prev.jobPerformance - performanceDecay) : 50;

      // Random events based on performance
      if (prev.currentJob && prev.jobPerformance > 90 && Math.random() < 0.2) {
        newLogs.unshift(`Bonus: Your hard work paid off! You received a $5,000 performance bonus.`);
        // money handled in main state return for simplicity (refactoring would be better but let's keep it tight)
      } else if (prev.currentJob && prev.jobPerformance < 20 && Math.random() < 0.2) {
        newLogs.unshift(`Fired: You were fired for poor performance!`);
        // we'll handle actual job loss in the return
      }

      // Relationship natural decay
      const newRelationships = prev.relationships.map(rel => ({
        ...rel,
        closeness: Math.max(0, rel.closeness - (Math.random() * 5))
      }));

      // Random social events
      if (Math.random() < 0.15) {
        const name = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
        const types: Relationship['type'][] = ['Friend', 'Partner'];
        const type = types[Math.floor(Math.random() * types.length)];
        newRelationships.push({
          id: Math.random().toString(36).substr(2, 9),
          name,
          type,
          closeness: 40 + Math.random() * 20
        });
        newLogs.unshift(`Met someone: You started a new ${type} relationship with ${name}.`);
      }

      // Partner/Spouse events
      const partner = prev.relationships.find(r => r.type === 'Partner' || r.type === 'Spouse');
      if (partner && Math.random() < 0.2) {
        const events = [
          { msg: `${partner.name} bought you a nice gift!`, happ: 15, close: 10 },
          { msg: `You and ${partner.name} had a small argument.`, happ: -10, close: -15 },
          { msg: `${partner.name} is feeling neglected.`, happ: -5, close: -10 },
          { msg: `You and ${partner.name} had a wonderful anniversary.`, happ: 20, close: 15 },
        ];
        const event = events[Math.floor(Math.random() * events.length)];
        newLogs.unshift(`Romance: ${event.msg}`);
        newHappiness += event.happ;
        const updatedRels = newRelationships.map(r => {
          if (r.id === partner.id) return { ...r, closeness: Math.max(0, Math.min(100, r.closeness + event.close)) };
          return r;
        });
        // We need to ensure we use these updated rels. 
        // This is tricky inside a map/reduce pattern but since we are in a let block for newRelationships it works if we update it.
        newRelationships.forEach((r, idx) => {
          if (r.id === partner.id) {
            newRelationships[idx].closeness = Math.max(0, Math.min(100, r.closeness + event.close));
          }
        });
      }

      // Random events
      if (Math.random() < 0.1) {
        const events = [
          { msg: "You caught a bad flu.", hlth: -20, happ: -10 },
          { msg: "You won a small lottery prize of $1,000!", happ: 20 },
          { msg: "Your water heater broke, cost $500.", happ: -15 },
          { msg: "Family reunion was a blast!", happ: 25 },
        ];
        const event = events[Math.floor(Math.random() * events.length)];
        newLogs.unshift(`Event: ${event.msg}`);
        if ('hlth' in event) newHealth += event.hlth || 0;
        if ('happ' in event) newHappiness += event.happ || 0;
      }

      // Death check
      const isDead = newHealth <= 0 || newAge > 100 || (newAge > 70 && Math.random() < (newAge - 70) / 100);

      if (isDead) {
        newLogs.unshift(`Rest in peace. You lived to the age of ${newAge}.`);
      }

      const jobLost = (prev.currentJob && prev.jobPerformance < 20 && Math.random() < 0.2);

      return {
        ...prev,
        age: newAge,
        money: (prev.currentJob && prev.jobPerformance > 90 && Math.random() < 0.2) ? newMoney + 5000 : newMoney,
        yearsAtCurrentJob: jobLost ? 0 : newYearsAtJob,
        currentJob: jobLost ? null : prev.currentJob,
        jobPerformance: newPerformance,
        health: Math.max(0, Math.min(100, newHealth)),
        fitness: Math.max(0, Math.min(100, newFitness)),
        happiness: Math.max(0, Math.min(100, newHappiness)),
        relationships: newRelationships,
        log: newLogs.slice(0, 50),
        isDead
      };
    });
  };

  const applyJob = (job: Job) => {
    // Education Check
    if (state.education === EducationLevel.Doctorate) {
        // Can take any job if experience matches
    } else if (state.education === EducationLevel.University && job.educationRequired === EducationLevel.Doctorate) {
        addLog(`Rejected: You need a Doctorate degree.`);
        return;
    } else if (state.education === EducationLevel.HighSchool && (job.educationRequired === EducationLevel.University || job.educationRequired === EducationLevel.Doctorate)) {
        addLog(`Rejected: Higher education required.`);
        return;
    }

    // Experience Check
    if (job.yearsExperienceRequired && state.yearsAtCurrentJob < job.yearsExperienceRequired) {
      addLog(`Rejected: Need ${job.yearsExperienceRequired} yrs exp, you have ${state.yearsAtCurrentJob}.`);
      return;
    }

    // Smarts Check
    if (job.minSmarts && state.smarts < job.minSmarts) {
      addLog(`Rejected: You're not smart enough for this role.`);
      return;
    }

    // Looks Check
    if (job.minLooks && state.looks < job.minLooks) {
      addLog(`Rejected: Your appearance doesn't meet the requirements.`);
      return;
    }

    // Health Check
    if (job.minHealth && state.health < job.minHealth) {
      addLog(`Rejected: You're not healthy enough for this career.`);
      return;
    }

    // Fitness Check
    if (job.minFitness && state.fitness < job.minFitness) {
      addLog(`Rejected: You're not physically fit enough for this professional sport.`);
      return;
    }

    // High Salary Competition
    if (job.salary > 200000) {
        const rejectionChance = 0.5 + (job.salary / 10000000); // Higher salary = higher baseline rejection
        const playerStrength = (state.smarts + state.looks + (state.fitness / 2)) / 250; // Normalize stats
        if (Math.random() > playerStrength / rejectionChance) {
            addLog(`Rejected: There were more qualified candidates for this prestigious position.`);
            return;
        }
    }

    setState(prev => ({
      ...prev,
      currentJob: job,
      yearsAtCurrentJob: 0,
      jobPerformance: 50,
      log: [`New Career: You are now a ${job.title}.`, ...prev.log]
    }));
  };

  const retire = () => {
    if (!state.currentJob) return;
    setState(prev => ({
      ...prev,
      currentJob: null,
      yearsAtCurrentJob: 0,
      jobPerformance: 50,
      log: [`Retirement: You resigned from your position as ${prev.currentJob?.title}.`, ...prev.log]
    }));
  };

  const workHard = () => {
    if (!state.currentJob) return;
    setState(prev => ({
      ...prev,
      jobPerformance: Math.min(100, prev.jobPerformance + 15),
      happiness: Math.max(0, prev.happiness - 5),
      log: [`Work: You put in extra hours at ${prev.currentJob?.title}.`, ...prev.log]
    }));
  };

  const interactWithRel = (relId: string) => {
    setState(prev => {
      const rel = prev.relationships.find(r => r.id === relId);
      if (!rel) return prev;

      let closenessBoost = 10;
      let happyBoost = 2;
      let logMsg = `Social: You spent time with ${rel.name}.`;

      if (rel.type === 'Partner' || rel.type === 'Spouse') {
        closenessBoost = 15;
        happyBoost = 5;
        logMsg = `Romance: You had a lovely date with your ${rel.type.toLowerCase()}, ${rel.name}.`;
      }

      const newRels = prev.relationships.map(r => {
        if (r.id === relId) {
          return { ...r, closeness: Math.min(100, r.closeness + closenessBoost) };
        }
        return r;
      });

      return {
        ...prev,
        relationships: newRels,
        happiness: Math.min(100, prev.happiness + happyBoost),
        log: [logMsg, ...prev.log]
      };
    });
  };

  const askOut = (relId: string) => {
    setState(prev => {
      const rel = prev.relationships.find(r => r.id === relId);
      if (!rel || rel.closeness < 40) {
        addLog(`Rejected: ${rel?.name} isn't interested in dating right now.`);
        return prev;
      }

      if (prev.relationships.some(r => r.type === 'Partner' || r.type === 'Spouse')) {
        addLog(`Conflict: You are already in a committed relationship!`);
        return prev;
      }

      const success = Math.random() < (rel.closeness / 100);
      if (success) {
        const newRels = prev.relationships.map(r => {
          if (r.id === relId) return { ...r, type: 'Partner' as const, closeness: Math.min(100, r.closeness + 10) };
          return r;
        });
        return {
          ...prev,
          relationships: newRels,
          happiness: Math.min(100, prev.happiness + 20),
          log: [`Romance: ${rel.name} is now your partner!`, ...prev.log]
        };
      } else {
        addLog(`Rejected: ${rel.name} wants to stay just friends.`);
        return prev;
      }
    });
  };

  const proposeToPartner = (relId: string) => {
    setState(prev => {
      const rel = prev.relationships.find(r => r.id === relId);
      if (!rel || rel.type !== 'Partner') return prev;

      if (rel.closeness < 80) {
        addLog(`Rejected: It's too soon for ${rel.name} to think about marriage.`);
        return prev;
      }

      const cost = 5000; // Engagement ring
      if (prev.money < cost) {
        addLog(`Failed: You need $5,000 for a decent engagement ring!`);
        return prev;
      }

      const success = Math.random() < (rel.closeness / 100);
      if (success) {
        const newRels = prev.relationships.map(r => {
          if (r.id === relId) return { ...r, type: 'Spouse' as const, closeness: 100 };
          return r;
        });
        return {
          ...prev,
          money: prev.money - cost,
          relationships: newRels,
          happiness: Math.min(100, prev.happiness + 50),
          log: [`Wedding: You and ${rel.name} are now married!`, ...prev.log]
        };
      } else {
        return {
          ...prev,
          money: prev.money - cost,
          happiness: Math.max(0, prev.happiness - 30),
          log: [`Heartbreak: ${rel.name} rejected your proposal.`, ...prev.log]
        };
      }
    });
  };

  const breakUp = (relId: string) => {
    setState(prev => {
      const rel = prev.relationships.find(r => r.id === relId);
      if (!rel) return prev;

      const isSerious = rel.type === 'Partner' || rel.type === 'Spouse';
      const newRels = prev.relationships.filter(r => r.id !== relId);
      
      return {
        ...prev,
        relationships: newRels,
        happiness: Math.max(0, prev.happiness - (isSerious ? 40 : 10)),
        log: [`Breakup: You ended your relationship with ${rel.name}.`, ...prev.log]
      };
    });
  };

  const findDate = () => {
    const cost = 100;
    if (state.money < cost) {
      addLog("Failed: You need $100 for a dating app subscription.");
      return;
    }

    const name = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    const newRel: Relationship = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type: 'Friend',
      closeness: 30 + Math.random() * 20
    };

    setState(prev => ({
      ...prev,
      money: prev.money - cost,
      relationships: [...prev.relationships, newRel],
      log: [`Dating: You met ${name} on a dating app.`, ...prev.log]
    }));
  };

  const buyEntertainment = (ent: any) => {
    if (state.money < ent.cost) {
      addLog(`Failed: Not enough money for ${ent.name}.`);
      return;
    }
    setState(prev => ({
      ...prev,
      money: prev.money - ent.cost,
      happiness: Math.min(100, prev.happiness + (ent.happinessBonus || 0)),
      health: Math.max(0, Math.min(100, prev.health + (ent.healthBonus || 0))),
      fitness: Math.max(0, Math.min(100, prev.fitness + (ent.fitnessBonus || 0))),
      smarts: Math.max(0, Math.min(100, prev.smarts + (ent.smartsBonus || 0))),
      looks: Math.max(0, Math.min(100, prev.looks + (ent.looksBonus || 0))),
       log: [`Activity: You did ${ent.name}.`, ...prev.log]
    }));
  };

  const buyAsset = (asset: Asset) => {
    if (state.money < asset.price) {
      addLog(`Failed: Not enough money for ${asset.name}.`);
      return;
    }
    setState(prev => ({
      ...prev,
      money: prev.money - asset.price,
      assets: [...prev.assets, asset],
      log: [`Purchase: You bought ${asset.name}.`, ...prev.log]
    }));
  };

  const study = () => {
    const cost = 25000;
    if (state.money < cost) {
      addLog("Failed: Need $25,000 for university fees.");
      return;
    }

    let nextEdu = state.education;
    let message = "";
    if (state.education === EducationLevel.HighSchool) {
      nextEdu = EducationLevel.University;
      message = "Graduation: You earned your University Degree!";
    } else if (state.education === EducationLevel.University) {
      nextEdu = EducationLevel.Doctorate;
      message = "Graduation: You earned your Doctorate!";
    } else {
      addLog("You already have a Doctorate.");
      return;
    }

    setState(prev => ({
      ...prev,
      money: prev.money - cost,
      education: nextEdu,
      smarts: Math.min(100, prev.smarts + 20),
      happiness: Math.min(100, prev.happiness + 15),
      log: [message, ...prev.log]
    }));
  };

  const resetGame = () => {
    setState(createInitialState(state.name));
    setIsNamingScreen(true);
    setActiveTab('life');
  };

  const handleStartGame = () => {
    if (!nameInput.trim()) return;
    setState(prev => ({ ...prev, name: nameInput.trim() }));
    setIsNamingScreen(false);
  };

  const emergencyBoost = (attr: 'health' | 'happiness' | 'smarts' | 'looks' | 'fitness') => {
    const cost = 500;
    if (state.money < cost) {
        addLog(`Emergency: Not enough money ($500) for a boost!`);
        return;
    }

    setState(prev => ({
        ...prev,
        money: prev.money - cost,
        [attr]: Math.min(100, prev[attr] + 30),
        log: [`Emergency: You received a professional boost to your ${attr}.`, ...prev.log]
    }));
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-gray-300 font-sans selection:bg-cyber-blue selection:text-black">
      <div className="crt-overlay" />
      {/* HUD / Stats Bar */}
      <header className="sticky top-0 z-10 bg-cyber-bg/80 backdrop-blur-xl border-b border-cyber-border p-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-8 justify-between items-center text-cyber-blue">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black opacity-40 italic font-mono">Terminal_Identity</span>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl italic uppercase tracking-widest text-cyber-green">{state.name || 'ANONYMOUS'}</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black opacity-40 font-mono">Uptime_Metric</span>
            <div className="flex items-center gap-2 text-white">
              <Calendar className="w-4 h-4 opacity-50" />
              <span className="font-mono text-2xl font-black">{state.age} <span className="text-xs font-normal opacity-50">CYCLES</span></span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black opacity-40 font-mono">Net_Credit_Flow</span>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 opacity-50 text-cyber-green" />
              <span className="font-mono text-2xl font-black text-cyber-green">${state.money.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <StatBar label="Vitality" value={state.health} icon={<Heart className="w-3 h-3" />} color="bg-cyber-pink" />
            <StatBar label="Chassis" value={state.fitness} icon={<TrendingUp className="w-3 h-3" />} color="bg-cyber-gold" />
            <StatBar label="Neural" value={state.happiness} icon={<Smile className="w-3 h-3" />} color="bg-cyber-blue" />
            <StatBar label="Logic" value={state.smarts} icon={<GraduationCap className="w-3 h-3" />} color="bg-white" />
            <StatBar label="Optics" value={state.looks} icon={<User className="w-3 h-3" />} color="bg-purple-500" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Navigation Sidebar */}
          <nav className="lg:col-span-3 space-y-2">
            <TabButton active={activeTab === 'life'} onClick={() => setActiveTab('life')} icon={<User />} label="Bio_Log" />
            <TabButton active={activeTab === 'social'} onClick={() => setActiveTab('social')} icon={<Users />} label="Nodes" />
            <TabButton active={activeTab === 'job'} onClick={() => setActiveTab('job')} icon={<Briefcase />} label="Sector" />
            <TabButton active={activeTab === 'activities'} onClick={() => setActiveTab('activities')} icon={<Film />} label="System" />
            <TabButton active={activeTab === 'assets'} onClick={() => setActiveTab('assets')} icon={<Home />} label="Assets" />
            <TabButton active={activeTab === 'shop'} onClick={() => setActiveTab('shop')} icon={<ShoppingBag />} label="Market" />
            
            <button 
              onClick={handleAgeUp}
              disabled={state.isDead || isNamingScreen}
              className="w-full mt-10 bg-cyber-blue text-black py-6 rounded-none font-display text-xl uppercase tracking-widest hover:bg-cyber-green transition-all disabled:opacity-30 flex flex-col items-center justify-center gap-1 group cursor-pointer border-none active:scale-[0.98] shadow-[0_0_15px_rgba(0,240,255,0.3)] glow-blue hover:glow-green"
            >
              <TrendingUp className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span>Initiate Cycle</span>
            </button>

            {/* Emergency Boosts */}
            <div className="mt-8 space-y-2">
              {state.health < 10 && !state.isDead && (
                <EmergencyButton label="Vitality_Repair" color="bg-cyber-pink" icon={<Heart />} onClick={() => emergencyBoost('health')} />
              )}
              {state.fitness < 10 && !state.isDead && (
                <EmergencyButton label="Chassis_Tune" color="bg-cyber-gold" icon={<TrendingUp />} onClick={() => emergencyBoost('fitness')} />
              )}
              {state.happiness < 10 && !state.isDead && (
                <EmergencyButton label="Neural_Sync" color="bg-cyber-blue" icon={<Smile />} onClick={() => emergencyBoost('happiness')} />
              )}
              {state.smarts < 10 && !state.isDead && (
                <EmergencyButton label="Logic_Patch" color="bg-white" icon={<GraduationCap />} onClick={() => emergencyBoost('smarts')} />
              )}
              {state.looks < 10 && !state.isDead && (
                <EmergencyButton label="Optic_Refactor" color="bg-purple-600" icon={<User />} onClick={() => emergencyBoost('looks')} />
              )}
            </div>
          </nav>

          {/* Content Area */}
          <div className="lg:col-span-9 min-h-[70vh] bg-cyber-card/50 border border-cyber-border p-8 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-blue/5 blur-3xl rounded-full -mr-12 -mt-12" />
            <AnimatePresence mode="wait">
              {isNamingScreen ? (
                <motion.div 
                  key="naming"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[101] bg-cyber-bg flex items-center justify-center p-8"
                >
                  <div className="crt-overlay" />
                  <div className="w-full max-w-sm space-y-8 relative z-10">
                    <div className="space-y-2">
                       <h1 className="text-6xl font-display uppercase tracking-widest text-cyber-blue">User_Init</h1>
                       <p className="text-xs font-mono opacity-40 uppercase tracking-widest">Awaiting identity input for simulation start...</p>
                    </div>
                    <input 
                      autoFocus
                      type="text" 
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleStartGame()}
                      placeholder="ENTER_UID"
                      className="w-full bg-transparent border-b-2 border-cyber-blue p-4 text-4xl font-display tracking-widest outline-none text-cyber-green placeholder:opacity-10"
                    />
                    <button 
                      onClick={handleStartGame}
                      className="w-full bg-cyber-blue text-black py-6 font-display text-2xl uppercase tracking-widest hover:bg-cyber-green transition-all disabled:opacity-20 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                      disabled={!nameInput.trim()}
                    >
                      EXECUTE
                    </button>
                  </div>
                </motion.div>
              ) : null}

              {state.isDead ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
                >
                  <div className="crt-overlay" />
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="bg-cyber-bg text-gray-300 p-10 max-w-md w-full border border-cyber-pink/50 shadow-[0_0_50px_rgba(255,0,85,0.2)] relative text-center overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-cyber-pink shadow-[0_0_10px_rgba(255,0,85,0.5)]" />
                    <Skull className="w-20 h-20 mb-6 mx-auto text-cyber-pink animate-pulse" />
                    <h1 className="text-6xl font-display uppercase mb-2 tracking-widest text-white">System_Failure</h1>
                    <p className="text-sm mb-8 opacity-40 font-mono uppercase tracking-[0.3em]">Simulation terminated at age {state.age}.</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-10">
                      <div className="bg-white/5 p-4 border border-cyber-border">
                        <div className="text-[8px] font-mono uppercase opacity-40 mb-1">Final_Wealth</div>
                        <div className="text-xl font-mono text-cyber-green">${state.money.toLocaleString()}</div>
                      </div>
                      <div className="bg-white/5 p-4 border border-cyber-border">
                        <div className="text-[8px] font-mono uppercase opacity-40 mb-1">Last_Node</div>
                        <div className="text-sm font-technical uppercase truncate text-cyber-blue">{state.currentJob?.title || 'UNEMPLOYED'}</div>
                      </div>
                    </div>

                    <button 
                      onClick={resetGame}
                      className="w-full bg-cyber-pink text-white py-4 uppercase font-display text-2xl tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer active:scale-95 shadow-[0_0_20px_rgba(255,0,85,0.3)]"
                    >
                      Re_Initialize
                    </button>
                  </motion.div>
                </motion.div>
              ) : null}

              {activeTab === 'life' && (
                <motion.div key="life" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <SectionTitle title="Chronology" subtitle="Your life as it unfolds" />
                  <div className="space-y-4 h-[55vh] overflow-y-auto pr-4 custom-scrollbar">
                    {state.log.map((entry, i) => (
                      <div key={i} className={`p-5 group border-l-2 transition-all ${entry.startsWith('Event') ? 'border-cyber-gold bg-cyber-gold/5' : entry.startsWith('Year') ? 'border-cyber-blue bg-cyber-blue/5' : i === 0 ? 'border-cyber-green bg-cyber-green/5' : 'border-cyber-border bg-white/5'}`}>
                        <div className="text-[10px] font-mono uppercase opacity-30 mb-1">STAMP_{state.log.length - i}</div>
                        <p className="text-base font-technical tracking-wide text-gray-100 leading-snug uppercase">{entry}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'social' && (
                <motion.div key="social" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <SectionTitle title="The Social Fabric" subtitle="Family, friends, and connections" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {state.relationships.map(rel => (
                      <div key={rel.id} className={`p-5 border group hover:bg-white/5 transition-all cyber-panel ${rel.type === 'Spouse' ? 'border-cyber-pink shadow-[inset_0_0_10px_rgba(255,0,85,0.1)]' : rel.type === 'Partner' ? 'border-red-900' : 'border-cyber-border'}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className={`text-[10px] font-mono uppercase font-black px-2 py-0.5 mb-2 inline-block ${rel.type === 'Spouse' ? 'text-cyber-pink' : rel.type === 'Partner' ? 'text-red-500' : 'text-cyber-blue'}`}>[{rel.type}]</span>
                            <h3 className="text-2xl font-display tracking-widest text-white">{rel.name}</h3>
                          </div>
                          <div className="flex gap-2">
                            {rel.type === 'Friend' && (
                               <button 
                                onClick={() => askOut(rel.id)}
                                title="Ask Out"
                                className="p-3 bg-red-950/30 text-cyber-pink border border-red-900/50 hover:bg-cyber-pink hover:text-white transition-all cursor-pointer"
                              >
                                <Heart className="w-5 h-5" />
                              </button>
                            )}
                            {rel.type === 'Partner' && (
                               <button 
                                onClick={() => proposeToPartner(rel.id)}
                                title="Propose"
                                className="p-3 bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/50 hover:bg-cyber-pink hover:text-white transition-all cursor-pointer"
                              >
                                <Zap className="w-5 h-5 fill-current" />
                              </button>
                            )}
                            <button 
                              onClick={() => interactWithRel(rel.id)}
                              title="Spend Time"
                              className="p-3 bg-white/5 text-gray-400 border border-cyber-border hover:bg-cyber-blue hover:text-black transition-all cursor-pointer"
                            >
                              <Smile className="w-5 h-5" />
                            </button>
                            {(rel.type === 'Partner' || rel.type === 'Spouse' || rel.type === 'Friend') && rel.type !== 'Family' && (
                               <button 
                                onClick={() => breakUp(rel.id)}
                                title="Break Up / End Friendship"
                                className="p-3 bg-white/5 text-gray-600 border border-cyber-border hover:bg-cyber-pink hover:text-white hover:border-cyber-pink transition-all cursor-pointer"
                              >
                                <Skull className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono uppercase opacity-40">
                            <span>Relational_Sync</span>
                            <span>{Math.round(rel.closeness)}%</span>
                          </div>
                          <div className="h-0.5 bg-white/5 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${rel.closeness}%` }} className={`h-full ${rel.type === 'Spouse' ? 'bg-cyber-pink' : rel.type === 'Partner' ? 'bg-red-500' : 'bg-cyber-blue'}`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'job' && (
                <motion.div key="job" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <SectionTitle title="Corporate Ladder" subtitle="Forge your professional path" />
                  
                  <div className="bg-black/80 text-white p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border border-cyber-blue/30 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-cyber-blue opacity-30 shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
                    <div className="relative z-10">
                      <h3 className="text-[10px] font-mono uppercase opacity-50 mb-2 tracking-[0.2em]">Current_Subsystem_Occupancy</h3>
                      {state.currentJob ? (
                        <>
                          <div className="text-5xl font-display tracking-widest text-cyber-blue mb-4 uppercase">{state.currentJob.title}</div>
                          <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-mono uppercase opacity-40">Tenure</span>
                              <span className="text-xl font-mono text-white">{state.yearsAtCurrentJob} CYC</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-mono uppercase opacity-40">Efficiency</span>
                              <span className={`text-xl font-mono ${state.jobPerformance > 80 ? 'text-cyber-green' : state.jobPerformance < 30 ? 'text-cyber-pink' : 'text-white'}`}>{state.jobPerformance}%</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-mono uppercase opacity-40 text-cyber-blue">Payload</span>
                              <span className="text-xl font-mono text-cyber-green">${state.currentJob.salary.toLocaleString()}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-3xl font-display opacity-20 uppercase tracking-widest">IDLE_STATE // SEEKING_NODE</div>
                      )}
                    </div>
                    <div className="hidden md:flex flex-col justify-center items-end relative z-10">
                      <Zap className="w-16 h-16 opacity-10 absolute -right-4 -top-4" />
                      <div className="text-right">
                        <div className="text-[10px] uppercase opacity-50 mb-1">Financial Outlook</div>
                        <div className="text-3xl font-mono text-blue-400">${(monthlyIncome - monthlyExpenses).toFixed(0)}<span className="text-xs">/MO</span></div>
                      </div>
                    </div>
                    {state.currentJob && (
                      <div className="col-span-full mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                         <div className="text-xs opacity-50 uppercase tracking-widest italic">Success requires dedication. Performance affects bonuses.</div>
                         <button 
                          onClick={workHard}
                          className="bg-white text-black px-4 py-2 text-xs font-black uppercase hover:bg-white/90 active:scale-95 transition-all"
                         >
                           Work Hard
                         </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-cyber-card border border-cyber-border p-6 mb-8 font-mono">
                    <h3 className="text-[10px] uppercase opacity-30 mb-4 tracking-widest">Financial_Diagnostic // Monthly_Cycle</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                      <div>
                        <div className="text-[10px] uppercase opacity-40">Inflow</div>
                        <div className="text-lg text-cyber-green">${monthlyIncome.toFixed(0)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase opacity-40">Tax_Siphon</div>
                        <div className="text-lg text-cyber-pink">-${(annualTax / 12).toFixed(0)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase opacity-40">Base_Entropy</div>
                        <div className="text-lg text-cyber-pink">-${(state.yearlyExpenses / 12).toFixed(0)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase opacity-40">Asset_Drain</div>
                        <div className="text-lg text-cyber-pink">-${state.assets.reduce((acc, curr) => acc + curr.monthlyCost, 0).toFixed(0)}</div>
                      </div>
                      <div className="border-l border-cyber-border pl-4">
                        <div className="text-[10px] uppercase opacity-60 font-bold">Net_Residual</div>
                        <div className="text-xl text-cyber-blue">${(monthlyIncome - monthlyExpenses).toFixed(0)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-cyber-border pb-2">
                       <div className="flex items-center gap-4">
                        <h4 className="text-lg font-display uppercase tracking-[0.2em] text-cyber-blue">Available_Nodes</h4>
                        {state.currentJob && (
                          <button 
                            onClick={retire}
                            className="bg-cyber-pink/20 text-cyber-pink px-3 py-1 text-[10px] font-mono uppercase border border-cyber-pink/50 hover:bg-cyber-pink hover:text-white transition-all cursor-pointer"
                          >
                            Disconnect_Term
                          </button>
                        )}
                       </div>
                       <span className="text-[10px] font-mono opacity-30 uppercase tracking-widest">Global_Net_Filter</span>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {Object.entries(JOBS.reduce((acc, job) => {
                        if (!acc[job.category]) acc[job.category] = [];
                        acc[job.category].push(job);
                        return acc;
                      }, {} as Record<string, Job[]>)).map(([category, jobs]) => (
                        <div key={category} className="space-y-3">
                          <h5 className="text-[10px] font-mono uppercase text-cyber-blue opacity-60 tracking-[0.4em] mb-4 flex items-center gap-2">
                            <span className="w-1 h-1 bg-cyber-blue" /> {category}
                          </h5>
                          <div className="grid grid-cols-1 gap-3">
                            {jobs.map(job => (
                              <button 
                                key={job.id}
                                onClick={() => applyJob(job)}
                                disabled={job.id === state.currentJob?.id}
                                className={`p-5 border text-left group transition-all relative cyber-panel ${job.id === state.currentJob?.id ? 'border-cyber-blue bg-cyber-blue/5 opacity-100 cursor-default ring-1 ring-cyber-blue' : 'border-cyber-border hover:border-cyber-blue cursor-pointer'}`}
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <div className="font-display text-2xl uppercase tracking-widest text-white">{job.title}</div>
                                  <div className="font-mono text-cyber-green font-black text-lg">+{job.salary.toLocaleString()}</div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-[9px] font-mono uppercase tracking-widest opacity-40 items-start sm:items-center">
                                  <span className={state.education === job.educationRequired || state.education === EducationLevel.Doctorate ? 'text-gray-300' : 'text-cyber-pink italic'}>REQ: {job.educationRequired}</span>
                                  {job.yearsExperienceRequired && (
                                    <span className={state.yearsAtCurrentJob >= job.yearsExperienceRequired ? 'text-gray-300' : 'text-cyber-pink italic'}>EXP: {job.yearsExperienceRequired} CYC</span>
                                  )}
                                  {job.minSmarts && (
                                    <span className={state.smarts >= job.minSmarts ? 'text-gray-300' : 'text-cyber-pink italic'}>LOGIC: {job.minSmarts}</span>
                                  )}
                                  {job.minLooks && (
                                    <span className={state.looks >= job.minLooks ? 'text-gray-300' : 'text-cyber-pink italic'}>OPTICS: {job.minLooks}</span>
                                  )}
                                  {job.minFitness && (
                                    <span className={state.fitness >= job.minFitness ? 'text-gray-300' : 'text-cyber-pink italic'}>CHASSIS: {job.minFitness}</span>
                                  )}
                                </div>
                                {job.id === state.currentJob?.id && <div className="absolute top-2 right-2 flex items-center gap-1 text-[8px] font-mono uppercase text-cyber-blue"><Zap className="w-2 h-2" /> ACTIVE_LINK</div>}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'activities' && (
                <motion.div key="activities" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <SectionTitle title="Recreation" subtitle="Invest in your well-being" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="md:col-span-2 p-6 bg-cyber-blue/10 border border-cyber-blue/30 flex justify-between items-center group cyber-panel">
                        <div>
                          <h4 className="font-display text-2xl tracking-widest text-cyber-blue mb-1 flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Neuro_Upload</h4>
                          <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest">Attain a higher cognitive degree for elite node access.</p>
                        </div>
                        <button onClick={study} className="px-6 py-3 bg-cyber-blue text-black font-display text-lg uppercase tracking-widest hover:bg-cyber-green transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                          Connect // $25k
                        </button>
                     </div>

                      {ENTERTAINMENT.map(ent => (
                        <button 
                         key={ent.id}
                         onClick={() => buyEntertainment(ent)}
                         className="p-6 border border-cyber-border bg-cyber-card/50 hover:bg-cyber-blue hover:text-black transition-all text-left flex justify-between items-center group cursor-pointer cyber-panel"
                        >
                          <div>
                             <div className="font-display text-xl uppercase tracking-widest">{ent.name}</div>
                             <div className="flex flex-wrap gap-x-3 text-[9px] font-mono uppercase tracking-widest text-gray-500 group-hover:text-black/60">
                               {ent.happinessBonus > 0 && <span>Neural +{ent.happinessBonus}</span>}
                               {ent.healthBonus && <span>Vitality {ent.healthBonus > 0 ? '+' : ''}{ent.healthBonus}</span>}
                               {ent.fitnessBonus && <span>Chassis {ent.fitnessBonus > 0 ? '+' : ''}{ent.fitnessBonus}</span>}
                               {ent.smartsBonus && <span>Logic {ent.smartsBonus > 0 ? '+' : ''}{ent.smartsBonus}</span>}
                               {ent.looksBonus && <span>Optics {ent.looksBonus > 0 ? '+' : ''}{ent.looksBonus}</span>}
                             </div>
                          </div>
                          <div className="text-xl font-mono text-cyber-green group-hover:text-black">${ent.cost.toLocaleString()}</div>
                        </button>
                      ))}

                      <button 
                        onClick={findDate}
                        className="p-6 border border-cyber-pink/30 bg-cyber-pink/5 hover:bg-cyber-pink/20 transition-all text-left flex justify-between items-center group cursor-pointer col-span-1 md:col-span-2"
                      >
                        <div>
                          <div className="font-display text-xl text-cyber-pink uppercase tracking-widest flex items-center gap-2"><Heart className="w-5 h-5 fill-current" /> Initialize_Dating_Protocol</div>
                          <div className="text-[9px] font-mono uppercase tracking-widest text-cyber-pink/50">Ping potential social nodes for interaction</div>
                        </div>
                        <div className="text-xl font-mono text-cyber-pink font-black">$100</div>
                      </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'assets' && (
                <motion.div key="assets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <SectionTitle title="The Collection" subtitle="Your hard-earned inventory" />
                  
                  {state.assets.length === 0 ? (
                    <div className="py-24 text-center border border-dashed border-cyber-border bg-cyber-card/30">
                      <ShoppingBag className="w-16 h-16 mx-auto mb-6 opacity-5" />
                      <p className="text-2xl font-display uppercase tracking-widest opacity-20">No_Inventory_Detected</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {state.assets.map((asset, i) => (
                        <div key={i} className="p-6 border border-cyber-border bg-cyber-card/50 group hover:translate-x-1 hover:-translate-y-1 transition-all cyber-panel">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white/5 rounded-none border border-cyber-border">
                              {asset.type === 'House' && <Home className="w-6 h-6 text-cyber-blue" />}
                              {asset.type === 'Car' && <Car className="w-6 h-6 text-cyber-gold" />}
                              {asset.type === 'Pet' && <Dog className="w-6 h-6 text-cyber-green" />}
                            </div>
                            <div>
                               <h3 className="font-display text-xl uppercase tracking-widest text-white">{asset.name}</h3>
                               <span className="text-[10px] font-mono uppercase opacity-40 tracking-[0.2em]">{asset.type}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-end border-t border-cyber-border pt-4">
                            <div>
                               <div className="text-[10px] font-mono uppercase opacity-30">Current_Valuation</div>
                               <div className="font-mono font-bold text-cyber-green">${asset.price.toLocaleString()}</div>
                            </div>
                            <div className="text-right">
                               <div className="text-[10px] font-mono uppercase opacity-30">Cycle_Entropy</div>
                               <div className="font-mono text-cyber-pink">-${(asset.monthlyCost).toLocaleString()}<span className="text-[8px]">/mo</span></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'shop' && (
                <motion.div key="shop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                  <SectionTitle title="The Shop" subtitle="Procure high-value assets and companions" />
                  
                  <ShopSection title="Real Estate" icon={<Home />} items={HOUSES} buyFn={buyAsset} />
                  <ShopSection title="Luxury Autos" icon={<Car />} items={CARS} buyFn={buyAsset} />
                  <ShopSection title="Animal Companions" icon={<Dog />} items={PETS} buyFn={buyAsset} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-end">
          <div className="bg-cyber-bg border border-cyber-border text-cyber-blue p-4 text-[10px] font-mono uppercase tracking-[0.3em] pointer-events-auto shadow-[0_0_15px_rgba(0,0,0,0.5)]">
             System_Engine v2.0.42 // Link_Status: STABLE // {state.isDead ? 'EMERGENCY_HALT' : 'REALTIME_SIMULATION'}
          </div>
        </div>
      </footer>
    </div>
  );
}

function EmergencyButton({ label, color, icon, onClick }: { label: string; color: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <motion.button 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`w-full ${color} text-black p-4 flex items-center justify-between group cursor-pointer border-none shadow-[0_0_15px_rgba(0,0,0,0.3)] relative overflow-hidden`}
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white opacity-20" />
      <div className="flex items-center gap-3 relative z-10">
        <span className="p-1.5 bg-black/20 rounded shadow-inner">
          {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' })}
        </span>
        <span className="text-[11px] font-mono font-black uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-[10px] font-mono font-bold bg-black/20 px-2 py-0.5 rounded relative z-10">$500</div>
    </motion.button>
  );
}

function SectionTitle({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="mb-10 relative">
      <h2 className="text-5xl font-display uppercase tracking-widest text-white leading-none">{title}</h2>
      <p className="text-[10px] font-mono opacity-40 uppercase tracking-[0.4em] translate-y-2">{subtitle}</p>
      <div className="absolute -left-10 top-0 w-1 y-full bg-cyber-blue/30" />
    </div>
  );
}

function ShopSection({ title, icon, items, buyFn }: { title: string, icon: React.ReactNode, items: Asset[], buyFn: (a: Asset) => void }) {
  const categories = Object.entries(items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Asset[]>));

  return (
    <section>
      <h3 className="text-xs font-mono uppercase text-cyber-blue tracking-[0.4em] border-b border-cyber-border pb-2 mb-8 flex items-center gap-3">
        {icon} TERMINAL_MARKET // {title}
      </h3>
      <div className="space-y-10">
        {categories.map(([category, catItems]) => (
          <div key={category} className="space-y-4">
            <h4 className="text-[10px] font-mono uppercase text-gray-600 tracking-[0.3em] pl-1 relative flex items-center gap-4">
              <span className="bg-cyber-bg pr-4 relative z-10">{category}</span>
              <div className="flex-1 h-[1px] bg-cyber-border" />
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {catItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => buyFn(item)}
                  className="p-6 border border-cyber-border bg-cyber-card/30 hover:border-cyber-blue hover:bg-cyber-blue hover:text-black transition-all group cursor-pointer cyber-panel"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="font-display text-xl uppercase tracking-widest text-white group-hover:text-black">{item.name}</div>
                    <div className="text-xl font-mono font-bold text-cyber-green group-hover:text-black">${item.price.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between border-t border-cyber-border group-hover:border-black/20 pt-4 text-[10px] font-mono uppercase tracking-widest opacity-40 group-hover:opacity-100">
                    <span>Entropy_Rate</span>
                    <span className="text-cyber-pink group-hover:text-black">-${item.monthlyCost}/cyc</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DeathStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 p-6 border border-white/10">
      <div className="text-[10px] uppercase opacity-40 mb-1 font-black">{label}</div>
      <div className="text-2xl font-mono font-black italic">{value}</div>
    </div>
  );
}

function StatBar({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode, color: string }) {
  return (
    <div className="space-y-1 w-28">
      <div className="flex items-center justify-between text-[8px] font-mono uppercase tracking-widest opacity-60">
        <span className="flex items-center gap-1">{icon} {label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-0.5 bg-white/5 w-full overflow-hidden border border-cyber-border">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactElement; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 border border-cyber-border transition-all duration-300 group cursor-pointer relative overflow-hidden ${active ? 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue shadow-[0_0_15px_rgba(0,240,255,0.1)]' : 'bg-transparent text-gray-500 hover:text-white hover:bg-white/5'}`}
    >
      {active && <div className="absolute left-0 top-0 w-1 h-full bg-cyber-blue" />}
      <span className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'opacity-100' : 'opacity-40'}`}>
        {React.cloneElement(icon, { strokeWidth: 2 })}
      </span>
      <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">{label}</span>
    </button>
  );
}
