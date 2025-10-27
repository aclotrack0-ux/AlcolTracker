export interface AlcoholDrink {
  id: string;
  name: string;
  alcoholPercentage: number;
  volumeMl: number;
  isCustom: boolean;
}

export interface PredefinedDrink {
  type: 'beer' | 'wine' | 'bitter' | 'cocktail' | 'liquor';
  name: string;
  alcoholPercentage: number;
  volumeMl: number;
  count: number;
}

export interface CustomDrink {
  id: string;
  name: string;
  alcoholPercentage: number;
  volumeMl: number;
  count: number;
}

export interface BACInput {
  weight: number;
  gender: 'male' | 'female';
  predefinedDrinks: PredefinedDrink[];
  customDrinks: CustomDrink[];
  timeElapsed?: number; // in hours
  timeUnit?: 'minutes' | 'hours';
}

export interface BACResult {
  id: string;
  date: string;
  timestamp: number;
  input: BACInput;
  bacAtZero: number; // BAC at t=0
  bacAfterTime?: number; // BAC after time elapsed
  timeToSober: number; // hours
  status: 'sober' | 'mild' | 'moderate' | 'high' | 'dangerous';
  statusComment: string;
}

export interface SavedCustomDrink {
  id: string;
  name: string;
  alcoholPercentage: number;
  volumeMl: number;
}

export type Language = 'it' | 'en' | 'fr' | 'es' | 'de';
export type Theme = 'light' | 'dark';