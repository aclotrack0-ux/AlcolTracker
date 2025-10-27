import { BACInput, BACResult } from '@/types/bac';

/**
 * Calculate BAC using Widmark formula:
 * BAC = (A / (r * P)) - (β * t)
 * 
 * Where:
 * A = V * G * 0.8 (alcohol in grams)
 * V = volume in ml converted to grams
 * G = alcohol percentage
 * r = 0.68 for male, 0.55 for female
 * P = body weight in kg
 * β = 0.15 g/L/h (elimination rate)
 * t = time elapsed in hours
 */

const ALCOHOL_DENSITY = 0.8; // g/ml
const MALE_DISTRIBUTION = 0.68;
const FEMALE_DISTRIBUTION = 0.55;
const ELIMINATION_RATE = 0.15; // g/L/h

export const calculateBAC = (input: BACInput): Omit<BACResult, 'id' | 'date' | 'timestamp'> => {
  // Calculate total alcohol in grams
  let totalAlcoholGrams = 0;

  // Add predefined drinks
  input.predefinedDrinks.forEach(drink => {
    const alcoholGrams = (drink.volumeMl * (drink.alcoholPercentage / 100) * ALCOHOL_DENSITY) * drink.count;
    totalAlcoholGrams += alcoholGrams;
  });

  // Add custom drinks
  input.customDrinks.forEach(drink => {
    const alcoholGrams = (drink.volumeMl * (drink.alcoholPercentage / 100) * ALCOHOL_DENSITY) * drink.count;
    totalAlcoholGrams += alcoholGrams;
  });

  // Get distribution coefficient based on gender
  const distributionCoefficient = input.gender === 'male' ? MALE_DISTRIBUTION : FEMALE_DISTRIBUTION;

  // Calculate BAC at t=0
  const bacAtZero = totalAlcoholGrams / (distributionCoefficient * input.weight);

  // Calculate BAC after time elapsed (if provided)
  let bacAfterTime: number | undefined;
  let timeInHours = 0;

  if (input.timeElapsed !== undefined && input.timeElapsed > 0) {
    timeInHours = input.timeUnit === 'minutes' 
      ? input.timeElapsed / 60 
      : input.timeElapsed;
    
    bacAfterTime = Math.max(0, bacAtZero - (ELIMINATION_RATE * timeInHours));
  }

  // Calculate time to sober (BAC = 0)
  const timeToSober = bacAtZero / ELIMINATION_RATE;

  // Determine status based on current BAC
  const currentBAC = bacAfterTime !== undefined ? bacAfterTime : bacAtZero;
  let status: BACResult['status'];
  let statusComment: string;

  if (currentBAC < 0.2) {
    status = 'sober';
    statusComment = 'statusSober';
  } else if (currentBAC < 0.5) {
    status = 'mild';
    statusComment = 'statusMild';
  } else if (currentBAC < 1.5) {
    status = 'moderate';
    statusComment = 'statusModerate';
  } else if (currentBAC < 2.5) {
    status = 'high';
    statusComment = 'statusHigh';
  } else {
    status = 'dangerous';
    statusComment = 'statusDangerous';
  }

  return {
    input,
    bacAtZero: Number(bacAtZero.toFixed(3)),
    bacAfterTime: bacAfterTime !== undefined ? Number(bacAfterTime.toFixed(3)) : undefined,
    timeToSober: Number(timeToSober.toFixed(2)),
    status,
    statusComment,
  };
};

export const validateBACInput = (input: Partial<BACInput>): { valid: boolean; error?: string } => {
  if (!input.weight || input.weight <= 0) {
    return { valid: false, error: 'enterWeight' };
  }

  if (!input.gender) {
    return { valid: false, error: 'selectGender' };
  }

  const hasPredefinedDrinks = input.predefinedDrinks && input.predefinedDrinks.some(d => d.count > 0);
  const hasCustomDrinks = input.customDrinks && input.customDrinks.some(d => d.count > 0);

  if (!hasPredefinedDrinks && !hasCustomDrinks) {
    return { valid: false, error: 'addAtLeastOneDrink' };
  }

  return { valid: true };
};