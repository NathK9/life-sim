import { EducationLevel, Job, Asset } from './types';

export const JOBS: Job[] = [
  // Food & Service
  { id: '1', title: 'Cashier', salary: 14000, educationRequired: EducationLevel.None, stress: 20, category: 'Food & Service' },
  { id: '1.2', title: 'Barista', salary: 18000, educationRequired: EducationLevel.None, stress: 25, category: 'Food & Service' },
  { id: '1.3', title: 'Waiter', salary: 20000, educationRequired: EducationLevel.None, stress: 35, category: 'Food & Service' },
  { id: '1.4', title: 'Line Cook', salary: 24000, educationRequired: EducationLevel.None, stress: 45, category: 'Food & Service' },
  { id: '1.5', title: 'Bartender', salary: 25000, educationRequired: EducationLevel.None, stress: 40, minLooks: 40, category: 'Food & Service' },
  { id: '1.6', title: 'Restaurant Manager', salary: 38000, educationRequired: EducationLevel.HighSchool, stress: 60, yearsExperienceRequired: 3, category: 'Food & Service' },
  
  // Logistics
  { id: '2', title: 'Delivery Driver', salary: 19000, educationRequired: EducationLevel.HighSchool, stress: 30, category: 'Logistics' },
  { id: '2.2', title: 'Uber Driver', salary: 22000, educationRequired: EducationLevel.HighSchool, stress: 35, category: 'Logistics' },
  { id: '2.3', title: 'Truck Driver', salary: 35000, educationRequired: EducationLevel.HighSchool, stress: 45, category: 'Logistics' },
  { id: '2.4', title: 'Warehouse Supervisor', salary: 32000, educationRequired: EducationLevel.HighSchool, stress: 40, yearsExperienceRequired: 2, category: 'Logistics' },
  
  // Office & Business
  { id: '2.5', title: 'Junior Accountant', salary: 28000, educationRequired: EducationLevel.University, stress: 35, minSmarts: 40, category: 'Office & Business' },
  { id: '2.6', title: 'Admin Assistant', salary: 24000, educationRequired: EducationLevel.HighSchool, stress: 25, category: 'Office & Business' },
  { id: '2.7', title: 'Bank Teller', salary: 26000, educationRequired: EducationLevel.HighSchool, stress: 30, category: 'Office & Business' },
  { id: '2.8', title: 'HR Generalist', salary: 36000, educationRequired: EducationLevel.University, stress: 40, category: 'Office & Business' },
  { id: '2.9', title: 'Social Media Manager', salary: 32000, educationRequired: EducationLevel.University, stress: 35, minLooks: 40, category: 'Office & Business' },
  
  // Arts & Design
  { id: '3', title: 'Graphic Designer', salary: 35000, educationRequired: EducationLevel.University, stress: 40, minLooks: 30, category: 'Arts & Design' },
  { id: '3.1', title: 'Photographer', salary: 28000, educationRequired: EducationLevel.None, stress: 30, minLooks: 30, category: 'Arts & Design' },
  { id: '3.2', title: 'Fashion Designer', salary: 45000, educationRequired: EducationLevel.University, stress: 55, minLooks: 60, category: 'Arts & Design' },
  { id: '3.3', title: 'Music Producer', salary: 38000, educationRequired: EducationLevel.None, stress: 45, minSmarts: 50, category: 'Arts & Design' },
  
  // Tech
  { id: '4', title: 'Software Engineer', salary: 65000, educationRequired: EducationLevel.University, stress: 50, minSmarts: 65, category: 'Tech' },
  { id: '4.1', title: 'Data Scientist', salary: 75000, educationRequired: EducationLevel.University, stress: 55, minSmarts: 75, category: 'Tech' },
  { id: '4.2', title: 'Architect', salary: 60000, educationRequired: EducationLevel.University, stress: 55, minSmarts: 65, category: 'Tech' },
  { id: '4.3', title: 'Cybersecurity Analyst', salary: 68000, educationRequired: EducationLevel.University, stress: 60, minSmarts: 70, category: 'Tech' },
  { id: '4.4', title: 'AI Ethics Researcher', salary: 85000, educationRequired: EducationLevel.Doctorate, stress: 50, minSmarts: 85, category: 'Tech' },

  // Healthcare
  { id: '5', title: 'Nurse', salary: 48000, educationRequired: EducationLevel.University, stress: 65, category: 'Healthcare' },
  { id: '5.1', title: 'Doctor', salary: 120000, educationRequired: EducationLevel.Doctorate, stress: 70, minSmarts: 85, category: 'Healthcare' },
  { id: '5.2', title: 'Surgeon', salary: 210000, educationRequired: EducationLevel.Doctorate, stress: 85, yearsExperienceRequired: 8, minSmarts: 95, category: 'Healthcare' },
  { id: '5.3', title: 'Pharmacist', salary: 85000, educationRequired: EducationLevel.Doctorate, stress: 50, minSmarts: 85, category: 'Healthcare' },
  { id: '5.4', title: 'Dentist', salary: 110000, educationRequired: EducationLevel.Doctorate, stress: 60, minSmarts: 80, category: 'Healthcare' },

  // Legal & High-Level
  { id: '4.8', title: 'Lawyer', salary: 90000, educationRequired: EducationLevel.University, stress: 75, minSmarts: 80, category: 'Legal & High-Level' },
  { id: '4.9', title: 'Judge', salary: 140000, educationRequired: EducationLevel.Doctorate, stress: 80, yearsExperienceRequired: 15, minSmarts: 90, category: 'Legal & High-Level' },
  { id: '6', title: 'CEO', salary: 350000, educationRequired: EducationLevel.University, stress: 90, yearsExperienceRequired: 15, minSmarts: 85, minLooks: 60, category: 'Legal & High-Level' },
  
  // Science & Special
  { id: '7', title: 'Astronaut', salary: 95000, educationRequired: EducationLevel.Doctorate, stress: 95, yearsExperienceRequired: 10, minSmarts: 95, category: 'Science' },
  { id: '7.1', title: 'Nuclear Physicist', salary: 105000, educationRequired: EducationLevel.Doctorate, stress: 70, minSmarts: 90, category: 'Science' },
  { id: '7.2', title: 'Marine Biologist', salary: 52000, educationRequired: EducationLevel.University, stress: 40, minSmarts: 60, category: 'Science' },

  // Sports
  { id: 's1', title: 'NBA Player', salary: 1800000, educationRequired: EducationLevel.None, stress: 80, minFitness: 90, category: 'Sports' },
  { id: 's2', title: 'NFL Player', salary: 1200000, educationRequired: EducationLevel.None, stress: 85, minFitness: 95, category: 'Sports' },
  { id: 's3', title: 'MLB Player', salary: 950000, educationRequired: EducationLevel.None, stress: 75, minFitness: 85, category: 'Sports' },
  { id: 's4', title: 'F1 Driver', salary: 2200000, educationRequired: EducationLevel.None, stress: 95, minFitness: 90, minSmarts: 70, category: 'Sports' },
  { id: 's5', title: 'NHL Player', salary: 850000, educationRequired: EducationLevel.None, stress: 85, minFitness: 90, category: 'Sports' },
  { id: 's6', title: 'Soccer Star', salary: 2800000, educationRequired: EducationLevel.None, stress: 80, minFitness: 95, minLooks: 60, category: 'Sports' },
  { id: 's7', title: 'Tennis Pro', salary: 600000, educationRequired: EducationLevel.None, stress: 70, minFitness: 90, category: 'Sports' },
  { id: 's8', title: 'UFC Fighter', salary: 350000, educationRequired: EducationLevel.None, stress: 95, minFitness: 95, category: 'Sports' },
  { id: 's9', title: 'Pro Boxer', salary: 650000, educationRequired: EducationLevel.None, stress: 90, minFitness: 95, category: 'Sports' },
  { id: 's10', title: 'Pro Golfer', salary: 850000, educationRequired: EducationLevel.None, stress: 60, minFitness: 70, minSmarts: 50, category: 'Sports' },
  { id: 's11', title: 'Olympic Swimmer', salary: 150000, educationRequired: EducationLevel.None, stress: 85, minFitness: 98, category: 'Sports' },
];

export const HOUSES: Asset[] = [
  { id: 'h0', name: 'Rundown Trailer', price: 65000, monthlyCost: 800, type: 'House', category: 'Budget' },
  { id: 'h1', name: 'Small Apartment', price: 350000, monthlyCost: 2800, type: 'House', category: 'Standard' },
  { id: 'h1.5', name: 'Modern Condo', price: 750000, monthlyCost: 4500, type: 'House', category: 'Standard' },
  { id: 'h2', name: 'Suburban Home', price: 1800000, monthlyCost: 7500, type: 'House', category: 'Premium' },
  { id: 'h2.5', name: 'Beach House', price: 6500000, monthlyCost: 15000, type: 'House', category: 'Premium' },
  { id: 'h3', name: 'Luxury Villa', price: 18000000, monthlyCost: 35000, type: 'House', category: 'Luxury' },
  { id: 'h4', name: 'Grand Mansion', price: 65000000, monthlyCost: 120000, type: 'House', category: 'Luxury' },
  { id: 'h5', name: 'Floating Sky Palace', price: 450000000, monthlyCost: 800000, type: 'House', category: 'Exclusive' },
  { id: 'h6', name: 'Private Island Estate', price: 950000000, monthlyCost: 2000000, type: 'House', category: 'Exclusive' },
];

export const CARS: Asset[] = [
  { id: 'c0', name: 'Rusty Bicycle', price: 800, monthlyCost: 50, type: 'Car', category: 'Basic' },
  { id: 'c0.5', name: 'Electric Scooter', price: 2500, monthlyCost: 100, type: 'Car', category: 'Basic' },
  { id: 'c1', name: 'Beat-up Beater', price: 8000, monthlyCost: 500, type: 'Car', category: 'Budget' },
  { id: 'c1.2', name: 'Used Japanese Sedan', price: 25000, monthlyCost: 800, type: 'Car', category: 'Budget' },
  { id: 'c1.5', name: 'Brand New Hatchback', price: 45000, monthlyCost: 1200, type: 'Car', category: 'Standard' },
  { id: 'c1.6', name: 'Reliable SUV', price: 85000, monthlyCost: 1800, type: 'Car', category: 'Standard' },
  { id: 'c2', name: 'Italian Sportscar', price: 450000, monthlyCost: 6000, type: 'Car', category: 'Premium' },
  { id: 'c2.5', name: 'Luxury Electric Sedan', price: 250000, monthlyCost: 3500, type: 'Car', category: 'Premium' },
  { id: 'c3', name: 'Electric Hypercar', price: 5500000, monthlyCost: 25000, type: 'Car', category: 'Luxury' },
  { id: 'c4', name: 'Experimental Jetpack', price: 15000000, monthlyCost: 75000, type: 'Car', category: 'Exclusive' },
];

export const PETS: Asset[] = [
  { id: 'p0', name: 'Hamster', price: 200, monthlyCost: 100, type: 'Pet', category: 'Small' },
  { id: 'p0.5', name: 'Goldfish', price: 100, monthlyCost: 60, type: 'Pet', category: 'Small' },
  { id: 'p1', name: 'Golden Retriever', price: 5000, monthlyCost: 800, type: 'Pet', category: 'Domestic' },
  { id: 'p2', name: 'Persian Cat', price: 6000, monthlyCost: 750, type: 'Pet', category: 'Domestic' },
  { id: 'p3', name: 'Parrot', price: 4500, monthlyCost: 400, type: 'Pet', category: 'Exotic' },
  { id: 'p4', name: 'Albino Snake', price: 8000, monthlyCost: 700, type: 'Pet', category: 'Exotic' },
  { id: 'p5', name: 'Exotic Bengal Tiger', price: 500000, monthlyCost: 25000, type: 'Pet', category: 'Dangerous' },
  { id: 'p6', name: 'Pet Dragon (Komodo)', price: 1200000, monthlyCost: 45000, type: 'Pet', category: 'Dangerous' },
];

export interface Entertainment {
  id: string;
  name: string;
  cost: number;
  happinessBonus: number;
  healthBonus?: number;
  fitnessBonus?: number;
  smartsBonus?: number;
  looksBonus?: number;
}

export const ENTERTAINMENT: Entertainment[] = [
  { id: 'e1', name: 'Movie Night', cost: 50, happinessBonus: 5 },
  { id: 'e2', name: 'Nightclubbing', cost: 200, happinessBonus: 15, looksBonus: -2 },
  { id: 'e3', name: 'Music Festival', cost: 800, happinessBonus: 30, healthBonus: -5 },
  { id: 'e4', name: 'Dinner at 5-star Restaurant', cost: 400, happinessBonus: 20 },
  { id: 'e5', name: 'Gym Membership', cost: 100, happinessBonus: 5, fitnessBonus: 20, healthBonus: 5, looksBonus: 5 },
  { id: 'e6', name: 'Public Library', cost: 0, happinessBonus: 2, smartsBonus: 10 },
  { id: 'e7', name: 'Meditate', cost: 0, happinessBonus: 10, healthBonus: 2 },
  { id: 'e8', name: 'Plastic Surgery', cost: 15000, happinessBonus: 10, looksBonus: 30, healthBonus: -10 },
];

export const RANDOM_NAMES = ['Alex', 'Jaime', 'Casey', 'Jordan', 'Taylor', 'Riley', 'Quinn', 'Morgan', 'Skyler', 'Sydney'];
