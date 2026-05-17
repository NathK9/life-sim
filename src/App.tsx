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

  if (isNamingScreen) {
    return (
      <div className="min-h-screen bg-swiss-bg text-swiss-text flex items-center justify-center p-8 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-12 text-center"
        >
          <div className="space-y-4">
             <div className="w-20 h-2 w-full bg-swiss-accent mx-auto mb-8" />
             <h1 className="text-7xl font-black uppercase tracking-tighter leading-none italic">identity</h1>
             <p className="text-xs uppercase font-black tracking-widest opacity-60">Initialize new user session</p>
          </div>
          <div className="space-y-8">
            <input 
              autoFocus
              type="text" 
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStartGame()}
              placeholder="ENTER NAME"
              className="w-full bg-transparent border-b-8 border-swiss-border p-4 text-5xl font-black uppercase tracking-tighter outline-none focus:border-swiss-accent transition-colors text-center"
            />
            <button 
              onClick={handleStartGame}
              className="w-full bg-swiss-accent text-black py-8 font-black uppercase tracking-[0.2em] hover:bg-white transition-all disabled:opacity-20 text-xl cursor-pointer"
              disabled={!nameInput.trim()}
            >
              START JOURNEY
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-swiss-bg text-swiss-text font-sans p-4 md:p-8">
      {/* Top Header / Stats */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b-2 border-swiss-border p-4 px-6 mb-12">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-8 justify-between items-center">
          <div className="flex flex-col">
            <span className="stat-label">Identity</span>
            <div className="flex items-center gap-2">
              <span className="font-black text-4xl uppercase tracking-tighter leading-none text-white">{state.name || 'ANONYMOUS'}</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="stat-label">Age</span>
            <div className="flex items-center gap-2 text-white">
              <Calendar className="w-4 h-4" />
              <span className="font-black text-4xl leading-none">{state.age} <span className="text-xs font-normal opacity-50">YRS</span></span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="stat-label">Bank</span>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-swiss-accent" />
              <span className="font-black text-4xl text-swiss-accent leading-none">${state.money.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4 lg:mt-0 pb-1">
            <StatBar label="Health" value={state.health} icon={<Heart className="w-3 h-3" />} color="bg-swiss-warning" />
            <StatBar label="Fitness" value={state.fitness} icon={<TrendingUp className="w-3 h-3" />} color="bg-swiss-accent" />
            <StatBar label="Happiness" value={state.happiness} icon={<Smile className="w-4 h-4" />} color="bg-swiss-accent" />
            <StatBar label="Smarts" value={state.smarts} icon={<GraduationCap className="w-4 h-4" />} color="bg-white" />
            <StatBar label="Looks" value={state.looks} icon={<User className="w-4 h-4" />} color="bg-white" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto pt-44 md:pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Navigation Sidebar */}
          <nav className="lg:col-span-3 space-y-3">
            <TabButton active={activeTab === 'life'} onClick={() => setActiveTab('life')} icon={<User />} label="Journal" />
            <TabButton active={activeTab === 'social'} onClick={() => setActiveTab('social')} icon={<Users />} label="Social" />
            <TabButton active={activeTab === 'job'} onClick={() => setActiveTab('job')} icon={<Briefcase />} label="Career" />
            <TabButton active={activeTab === 'activities'} onClick={() => setActiveTab('activities')} icon={<Film />} label="System" />
            <TabButton active={activeTab === 'assets'} onClick={() => setActiveTab('assets')} icon={<Home />} label="Assets" />
            <TabButton active={activeTab === 'shop'} onClick={() => setActiveTab('shop')} icon={<ShoppingBag />} label="Market" />
            
            <button 
              onClick={handleAgeUp}
              disabled={state.isDead}
              className="w-full mt-10 bg-swiss-accent text-black py-8 rounded-none font-black uppercase tracking-[0.2em] hover:bg-white transition-all disabled:opacity-30 flex flex-col items-center justify-center gap-1 group cursor-pointer border-none active:scale-[0.98]"
            >
              <TrendingUp className="w-8 h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span>ADVANCE AGE</span>
            </button>

            {/* Emergency Boosts */}
            <div className="mt-8 space-y-3">
              {state.health < 10 && !state.isDead && (
                <EmergencyButton label="ER VISIT" color="bg-swiss-warning" icon={<Heart />} onClick={() => emergencyBoost('health')} />
              )}
              {state.fitness < 10 && !state.isDead && (
                <EmergencyButton label="TRAINER" color="bg-swiss-border" icon={<TrendingUp />} onClick={() => emergencyBoost('fitness')} />
              )}
              {state.happiness < 10 && !state.isDead && (
                <EmergencyButton label="THERAPY" color="bg-swiss-accent" icon={<Smile />} onClick={() => emergencyBoost('happiness')} />
              )}
              {state.smarts < 10 && !state.isDead && (
                <EmergencyButton label="TUTORING" color="bg-swiss-border" icon={<GraduationCap />} onClick={() => emergencyBoost('smarts')} />
              )}
              {state.looks < 10 && !state.isDead && (
                <EmergencyButton label="STYLIST" color="bg-swiss-border" icon={<User />} onClick={() => emergencyBoost('looks')} />
              )}
            </div>
          </nav>

          {/* Content Area */}
          <div className="lg:col-span-9 min-h-[70vh] bg-black border-2 border-swiss-border p-8 md:p-12 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {state.isDead ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6"
                >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="bg-black text-swiss-text p-12 max-w-lg w-full border-4 border-swiss-border relative text-center"
                  >
                    <Skull className="w-24 h-24 mb-8 mx-auto" />
                    <h1 className="text-6xl font-black uppercase mb-2 tracking-tighter italic">FINIS.</h1>
                    <p className="text-xl mb-12 opacity-40 font-black uppercase tracking-widest">End of simulation cycle {state.age}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-12">
                      <div className="p-6 border-2 border-swiss-border bg-swiss-muted">
                        <div className="stat-label">Final Value</div>
                        <div className="text-3xl font-black">${state.money.toLocaleString()}</div>
                      </div>
                      <div className="p-6 border-2 border-swiss-border bg-swiss-muted">
                        <div className="stat-label">Peak Role</div>
                        <div className="text-sm font-black uppercase truncate">{state.currentJob?.title || 'UNEMPLOYED'}</div>
                      </div>
                    </div>

                    <button 
                      onClick={resetGame}
                      className="w-full bg-swiss-border text-white py-6 uppercase font-black text-2xl tracking-widest hover:bg-swiss-accent transition-all cursor-pointer active:scale-95"
                    >
                      RESTART CYCLE
                    </button>
                  </motion.div>
                </motion.div>
              ) : null}

              {activeTab === 'life' && (
                <motion.div key="life" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                  <SectionTitle title="Chronology" subtitle="Historical record of life events" />
                  <div className="space-y-4 h-[55vh] overflow-y-auto pr-6 custom-scrollbar">
                    {state.log.map((entry, i) => (
                      <div key={i} className={`p-6 border-b-2 transition-all ${entry.startsWith('Event') ? 'bg-swiss-accent text-black border-none' : entry.startsWith('Year') ? 'border-swiss-border bg-swiss-muted text-white' : i === 0 ? 'bg-swiss-accent text-black border-none' : 'border-swiss-muted bg-black text-white'}`}>
                        <div className="text-[10px] uppercase font-black opacity-40 mb-1">MARKER_{state.log.length - i}</div>
                        <p className="text-xl font-black uppercase tracking-tighter italic leading-none">{entry}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'social' && (
                <motion.div key="social" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                  <SectionTitle title="Connections" subtitle="Interpersonal relationship status" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {state.relationships.map(rel => (
                      <div key={rel.id} className={`p-8 swiss-panel hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${rel.type === 'Spouse' ? 'border-swiss-accent' : 'border-swiss-border'}`}>
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 mb-2 inline-block ${rel.type === 'Spouse' ? 'bg-swiss-accent text-white' : 'bg-swiss-border text-white'}`}>{rel.type}</span>
                            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">{rel.name}</h3>
                          </div>
                          <div className="flex gap-2">
                            {rel.type === 'Friend' && (
                               <button 
                                onClick={() => askOut(rel.id)}
                                title="Ask Out"
                                className="p-3 bg-black border-2 border-swiss-border hover:bg-swiss-accent hover:text-white transition-all cursor-pointer"
                              >
                                <Heart className="w-5 h-5" />
                              </button>
                            )}
                            {rel.type === 'Partner' && (
                               <button 
                                onClick={() => proposeToPartner(rel.id)}
                                title="Propose"
                                className="p-3 bg-black border-2 border-swiss-accent text-swiss-accent hover:bg-swiss-accent hover:text-white transition-all cursor-pointer"
                              >
                                <Zap className="w-5 h-5 fill-current" />
                              </button>
                            )}
                            <button 
                              onClick={() => interactWithRel(rel.id)}
                              title="Spend Time"
                              className="p-3 bg-black border-2 border-swiss-border hover:bg-swiss-border hover:text-white transition-all cursor-pointer"
                            >
                              <Smile className="w-5 h-5" />
                            </button>
                            {(rel.type === 'Partner' || rel.type === 'Spouse' || rel.type === 'Friend') && rel.type !== 'Family' && (
                               <button 
                                onClick={() => breakUp(rel.id)}
                                title="Break Up / End Friendship"
                                className="p-3 bg-black border-2 border-swiss-warning text-swiss-warning hover:bg-swiss-warning hover:text-white transition-all cursor-pointer"
                              >
                                <Skull className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-40">
                            <span>Relational Synergy</span>
                            <span>{Math.round(rel.closeness)}%</span>
                          </div>
                          <div className="h-4 bg-swiss-muted border-2 border-swiss-border overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${rel.closeness}%` }} className={`h-full ${rel.type === 'Spouse' ? 'bg-swiss-accent' : 'bg-swiss-border'}`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'job' && (
                <motion.div key="job" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                  <SectionTitle title="Profession" subtitle="Career progression and fiscal status" />
                  
                  <div className="bg-swiss-border text-white p-10 grid grid-cols-1 md:grid-cols-2 gap-12 relative overflow-hidden">
                    <div className="relative z-10 space-y-8">
                      <div>
                        <h3 className="stat-label !text-white/40">Current Position</h3>
                        {state.currentJob ? (
                          <>
                            <div className="text-5xl font-black uppercase tracking-tighter mb-6 italic">{state.currentJob.title}</div>
                            <div className="grid grid-cols-2 gap-8">
                              <div>
                                <span className="stat-label !text-white/40">Tenure</span>
                                <span className="text-2xl font-black">{state.yearsAtCurrentJob} CYC</span>
                              </div>
                              <div>
                                <span className="stat-label !text-white/40">Efficiency</span>
                                <span className={`text-2xl font-black ${state.jobPerformance > 80 ? 'text-blue-400' : state.jobPerformance < 30 ? 'text-orange-400' : 'text-white'}`}>{state.jobPerformance}%</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-4xl font-black opacity-20 uppercase tracking-tighter">UNEMPLOYED // IDLE</div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col justify-end items-end relative z-10 text-right">
                      {state.currentJob && (
                        <div>
                          <span className="stat-label !text-white/40">Annual Payload</span>
                          <div className="text-6xl font-black text-swiss-accent leading-none">${state.currentJob.salary.toLocaleString()}</div>
                        </div>
                      )}
                    </div>
                    {state.currentJob && (
                      <div className="col-span-full mt-8 flex items-center justify-between border-t border-white/20 pt-8">
                         <div className="text-[10px] opacity-40 uppercase font-black tracking-widest italic">Performance determines eligibility for senior roles.</div>
                         <button 
                          onClick={workHard}
                          className="bg-black border-2 border-swiss-border text-white px-8 py-4 text-xs font-black uppercase hover:bg-swiss-accent hover:border-swiss-accent active:translate-y-1 transition-all"
                         >
                           Increase Workload
                         </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-swiss-muted border-2 border-swiss-border p-8 mb-12">
                    <h3 className="stat-label">Fiscal Report</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
                      <div>
                        <div className="stat-label">Revenue</div>
                        <div className="text-2xl font-black text-blue-600">${monthlyIncome.toFixed(0)}</div>
                      </div>
                      <div>
                        <div className="stat-label">Tax Deduction</div>
                        <div className="text-2xl font-black text-swiss-warning">-${(annualTax / 12).toFixed(0)}</div>
                      </div>
                      <div>
                        <div className="stat-label">Overhead</div>
                        <div className="text-2xl font-black text-swiss-warning">-${(state.yearlyExpenses / 12).toFixed(0)}</div>
                      </div>
                      <div>
                        <div className="stat-label">Asset Drain</div>
                        <div className="text-2xl font-black text-swiss-warning">-${state.assets.reduce((acc, curr) => acc + curr.monthlyCost, 0).toFixed(0)}</div>
                      </div>
                      <div className="border-l-2 border-swiss-border pl-8">
                        <div className="stat-label">Net Surplus</div>
                        <div className="text-4xl font-black text-swiss-accent">${(monthlyIncome - monthlyExpenses).toFixed(0)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b-4 border-swiss-border pb-4">
                       <div className="flex items-center gap-6">
                        <h4 className="text-3xl font-black uppercase tracking-tighter">Opportunities</h4>
                        {state.currentJob && (
                          <button 
                            onClick={retire}
                            className="border-2 border-swiss-warning text-swiss-warning px-4 py-2 text-[10px] font-black uppercase hover:bg-swiss-warning hover:text-white transition-all cursor-pointer"
                          >
                            Resign Position
                          </button>
                        )}
                       </div>
                       <span className="text-[10px] font-black uppercase opacity-30 tracking-widest">Global Sector Indices</span>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                      {Object.entries(JOBS.reduce((acc, job) => {
                        if (!acc[job.category]) acc[job.category] = [];
                        acc[job.category].push(job);
                        return acc;
                      }, {} as Record<string, Job[]>)).map(([category, jobs]) => (
                        <div key={category} className="space-y-6">
                          <h5 className="text-[10px] font-black uppercase bg-swiss-border text-white px-3 py-1 inline-block tracking-widest">{category}</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {jobs.map(job => (
                              <button 
                                key={job.id}
                                onClick={() => applyJob(job)}
                                disabled={job.id === state.currentJob?.id}
                                className={`p-8 border-2 text-left group transition-all relative ${job.id === state.currentJob?.id ? 'border-swiss-accent bg-swiss-muted cursor-default' : 'border-swiss-border hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'}`}
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <div className="font-black text-3xl uppercase tracking-tighter italic group-hover:text-swiss-accent transition-colors leading-none">{job.title}</div>
                                  <div className="font-black text-xl text-swiss-accent">${job.salary.toLocaleString()}</div>
                                </div>
                                <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest opacity-40">
                                  <span className={state.education === job.educationRequired || state.education === EducationLevel.Doctorate ? '' : 'text-swiss-warning underline'}>Req: {job.educationRequired}</span>
                                  {job.yearsExperienceRequired && (
                                    <span className={state.yearsAtCurrentJob >= job.yearsExperienceRequired ? '' : 'text-swiss-warning underline'}>Exp: {job.yearsExperienceRequired} CYC</span>
                                  )}
                                  {job.minSmarts && (
                                    <span className={state.smarts >= job.minSmarts ? '' : 'text-swiss-warning underline'}>Smarts: {job.minSmarts}</span>
                                  )}
                                </div>
                                {job.id === state.currentJob?.id && <div className="absolute top-2 right-2 text-[8px] font-black uppercase text-swiss-accent">ACTIVE ROLE</div>}
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
                <motion.div key="activities" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                  <SectionTitle title="Interaction" subtitle="Local engagement protocols" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="md:col-span-2 p-10 bg-swiss-muted border-4 border-swiss-border flex justify-between items-center group">
                        <div>
                          <h4 className="font-black text-4xl uppercase tracking-tighter mb-2 flex items-center gap-4 italic leading-none"><GraduationCap className="w-10 h-10" /> Education</h4>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Invest in higher certification to expand career parameters.</p>
                        </div>
                        <button onClick={study} className="swiss-button-primary text-xl">
                          ENROLL // $25k
                        </button>
                     </div>

                      {ENTERTAINMENT.map(ent => (
                        <button 
                         key={ent.id}
                         onClick={() => buyEntertainment(ent)}
                         className="p-8 border-2 border-swiss-border bg-black hover:bg-swiss-accent hover:text-white transition-all text-left flex justify-between items-center group cursor-pointer"
                        >
                          <div>
                             <div className="font-black text-2xl uppercase tracking-tighter italic leading-none mb-1">{ent.name}</div>
                             <div className="flex flex-wrap gap-x-4 text-[9px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">
                               {ent.happinessBonus > 0 && <span>Happy +{ent.happinessBonus}</span>}
                               {ent.healthBonus && <span>Hlth {ent.healthBonus > 0 ? '+' : ''}{ent.healthBonus}</span>}
                               {ent.fitnessBonus && <span>Fit {ent.fitnessBonus > 0 ? '+' : ''}{ent.fitnessBonus}</span>}
                               {ent.smartsBonus && <span>Smart {ent.smartsBonus > 0 ? '+' : ''}{ent.smartsBonus}</span>}
                             </div>
                          </div>
                          <div className="text-3xl font-black italic">${ent.cost.toLocaleString()}</div>
                        </button>
                      ))}

                      <button 
                        onClick={findDate}
                        className="p-8 border-4 border-dashed border-swiss-warning bg-swiss-warning/5 hover:bg-swiss-warning hover:text-white transition-all text-left flex justify-between items-center group cursor-pointer col-span-1 md:col-span-2"
                      >
                        <div>
                          <div className="font-black text-3xl uppercase tracking-tighter italic flex items-center gap-4 leading-none"><Heart className="w-8 h-8 fill-current" /> Initialize Social Protocol</div>
                          <div className="text-[10px] font-black uppercase tracking-widest opacity-50 group-hover:opacity-100">Scan for new interpersonal connections</div>
                        </div>
                        <div className="text-4xl font-black italic">$100</div>
                      </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'assets' && (
                <motion.div key="assets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                  <SectionTitle title="Possessions" subtitle="Physical asset inventory" />
                  
                  {state.assets.length === 0 ? (
                    <div className="py-24 text-center border-4 border-dashed border-swiss-muted bg-black">
                      <ShoppingBag className="w-16 h-16 mx-auto mb-6 opacity-5" />
                      <p className="text-2xl font-black uppercase tracking-widest opacity-20 italic">No Assets Detected</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {state.assets.map((asset, i) => (
                        <div key={i} className="p-8 border-2 border-swiss-border bg-black group hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all relative">
                          <div className="flex items-center gap-6 mb-6">
                            <div className="p-4 bg-swiss-muted border-2 border-swiss-border">
                              {asset.type === 'House' && <Home className="w-8 h-8 text-swiss-accent" />}
                              {asset.type === 'Car' && <Car className="w-8 h-8 text-swiss-warning" />}
                              {asset.type === 'Pet' && <Dog className="w-8 h-8 text-swiss-border" />}
                            </div>
                            <div>
                               <h3 className="font-black text-3xl uppercase tracking-tighter italic leading-none">{asset.name}</h3>
                               <span className="text-[10px] font-black uppercase opacity-40 tracking-[0.2em]">{asset.type}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-end border-t-2 border-swiss-muted pt-6">
                            <div>
                               <div className="stat-label">Current Value</div>
                               <div className="text-2xl font-black text-swiss-accent">${asset.price.toLocaleString()}</div>
                            </div>
                            <div className="text-right">
                               <div className="stat-label">Maintenance Cost</div>
                               <div className="text-xl font-black text-swiss-warning">-${(asset.monthlyCost).toLocaleString()}<span className="text-[10px]">/mo</span></div>
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
                  <SectionTitle title="Marketplace" subtitle="Asset procurement services" />
                  
                  <ShopSection title="Real Estate" icon={<Home />} items={HOUSES} buyFn={buyAsset} />
                  <ShopSection title="Luxury Autos" icon={<Car />} items={CARS} buyFn={buyAsset} />
                  <ShopSection title="Animal Companions" icon={<Dog />} items={PETS} buyFn={buyAsset} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-8 pointer-events-none z-10 hidden md:block">
        <div className="max-w-6xl mx-auto flex justify-between items-end">
          <div className="bg-swiss-border text-white p-6 text-[11px] font-black uppercase tracking-[0.4em] pointer-events-auto leading-none">
             SYSTEM STATUS: {state.isDead ? 'HALTED' : 'OPERATIONAL'} // CORE v.2.5.0
          </div>
        </div>
      </footer>
    </div>
  );
}

function EmergencyButton({ label, color, icon, onClick }: { label: string; color: string; icon: React.ReactNode; onClick: () => void }) {
  const isLight = color.includes('accent') || color.includes('white');
  return (
    <motion.button 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`w-full ${color} ${isLight ? 'text-black' : 'text-white'} p-6 flex items-center justify-between group cursor-pointer border-2 border-white/10 shadow-xl relative overflow-hidden`}
    >
      <div className="flex items-center gap-4 relative z-10">
        <div className="p-2 bg-black/20 rounded shadow-inner">
          {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
        </div>
        <span className="text-xs font-black uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-xl font-black bg-black/20 px-3 py-1 rounded relative z-10">$500</div>
    </motion.button>
  );
}

function SectionTitle({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="mb-16 relative border-l-8 border-swiss-border pl-8">
      <h2 className="text-8xl font-black uppercase tracking-tighter leading-[0.8] mb-4 italic">{title}</h2>
      <p className="text-xs font-black uppercase tracking-[0.5em] opacity-60">{subtitle}</p>
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
      <h3 className="text-xs font-black uppercase tracking-[0.4em] border-b-4 border-swiss-border pb-4 mb-12 flex items-center gap-4">
        {icon} GLOBAL MARKET // {title}
      </h3>
      <div className="space-y-16">
        {categories.map(([category, catItems]) => (
          <div key={category} className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] pl-1 relative flex items-center gap-6">
              <span className="bg-black pr-8 relative z-10">{category}</span>
              <div className="flex-1 h-[2px] bg-swiss-muted" />
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {catItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => buyFn(item)}
                  className="p-10 border-2 border-swiss-border bg-black hover:border-swiss-accent hover:shadow-[12px_12px_0px_0px_rgba(0,240,255,0.3)] transition-all group cursor-pointer text-left"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="font-black text-3xl uppercase tracking-tighter italic group-hover:text-swiss-accent leading-none">{item.name}</div>
                    <div className="text-4xl font-black italic">${item.price.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between border-t-2 border-swiss-muted pt-6 text-[10px] font-black uppercase tracking-widest opacity-40">
                    <span>Yearly Maintenance</span>
                    <span className="text-swiss-warning">-${item.monthlyCost}/cyc</span>
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
    <div className="bg-swiss-muted p-6 border-2 border-swiss-border">
      <div className="stat-label">{label}</div>
      <div className="text-2xl font-black italic uppercase leading-none">{value}</div>
    </div>
  );
}

function StatBar({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode, color: string }) {
  return (
    <div className="space-y-2 w-32">
      <div className="flex items-center justify-between">
        <span className="stat-label !mb-0">{label}</span>
        <span className="text-[10px] font-black">{Math.round(value)}%</span>
      </div>
      <div className="h-4 bg-swiss-muted border-2 border-swiss-border w-full overflow-hidden">
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
      className={`w-full flex items-center justify-between p-6 border-2 transition-all duration-200 group cursor-pointer ${active ? 'bg-swiss-accent text-black border-swiss-accent shadow-[12px_12px_0px_0px_rgba(0,240,255,0.4)]' : 'bg-transparent text-white border-transparent hover:bg-swiss-muted hover:border-swiss-muted'}`}
    >
      <div className="flex items-center gap-6">
        <span className={`w-6 h-6 transition-transform group-hover:scale-110 ${active ? 'opacity-100' : 'opacity-40'}`}>
          {React.cloneElement(icon, { strokeWidth: 3 })}
        </span>
        <span className="text-sm uppercase font-black tracking-widest leading-none">{label}</span>
      </div>
      {active && <Zap className="w-5 h-5 text-black animate-pulse" />}
    </button>
  );
}
