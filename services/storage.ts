import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACResult, SavedCustomDrink, Theme, Language } from '@/types/bac';

const STORAGE_KEYS = {
  BAC_RESULTS: '@alcoltracker_bac_results',
  CUSTOM_DRINKS: '@alcoltracker_custom_drinks',
  THEME: '@alcoltracker_theme',
  LANGUAGE: '@alcoltracker_language',
};

// BAC Results
export const saveBACResult = async (result: BACResult): Promise<void> => {
  try {
    const existing = await getBACResults();
    const updated = [...existing, result];
    await AsyncStorage.setItem(STORAGE_KEYS.BAC_RESULTS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving BAC result:', error);
    throw error;
  }
};

export const getBACResults = async (): Promise<BACResult[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.BAC_RESULTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting BAC results:', error);
    return [];
  }
};

export const deleteBACResult = async (id: string): Promise<void> => {
  try {
    const existing = await getBACResults();
    const updated = existing.filter(r => r.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.BAC_RESULTS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting BAC result:', error);
    throw error;
  }
};

// Custom Drinks
export const saveCustomDrink = async (drink: SavedCustomDrink): Promise<void> => {
  try {
    const existing = await getCustomDrinks();
    const updated = [...existing, drink];
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_DRINKS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving custom drink:', error);
    throw error;
  }
};

export const getCustomDrinks = async (): Promise<SavedCustomDrink[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_DRINKS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting custom drinks:', error);
    return [];
  }
};

export const deleteCustomDrink = async (id: string): Promise<void> => {
  try {
    const existing = await getCustomDrinks();
    const updated = existing.filter(d => d.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_DRINKS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting custom drink:', error);
    throw error;
  }
};

// Theme
export const saveTheme = async (theme: Theme): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Error saving theme:', error);
    throw error;
  }
};

export const getTheme = async (): Promise<Theme> => {
  try {
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    return (theme as Theme) || 'light';
  } catch (error) {
    console.error('Error getting theme:', error);
    return 'light';
  }
};

// Language
export const saveLanguage = async (language: Language): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  } catch (error) {
    console.error('Error saving language:', error);
    throw error;
  }
};

export const getLanguage = async (): Promise<Language> => {
  try {
    const language = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return (language as Language) || 'it';
  } catch (error) {
    console.error('Error getting language:', error);
    return 'it';
  }
};