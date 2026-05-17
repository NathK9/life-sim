export enum EducationLevel {
  None = 'None',
  HighSchool = 'High School',
  University = 'University',
  Doctorate = 'Doctorate',
}

export interface Job {
  id: string;
  title: string;
  salary: number;
  educationRequired: EducationLevel;
  stress: number;
  yearsExperienceRequired?: number;
  minSmarts?: number;
  minLooks?: number;
  minHealth?: number;
  minFitness?: number;
  category: string;
}

export interface Asset {
  id: string;
  name: string;
  price: number;
  monthlyCost: number;
  type: 'House' | 'Car' | 'Pet';
  category: string;
}

export interface Relationship {
  id: string;
  name: string;
  type: 'Family' | 'Friend' | 'Partner' | 'Spouse';
  closeness: number; // 0-100
}

export interface GameState {
  name: string;
  age: number;
  money: number;
  happiness: number;
  health: number;
  fitness: number;
  smarts: number;
  looks: number;
  education: EducationLevel;
  currentJob: Job | null;
  yearsAtCurrentJob: number;
  jobPerformance: number; // 0-100
  assets: Asset[];
  relationships: Relationship[];
  log: string[];
  isDead: boolean;
  yearlyExpenses: number;
}
