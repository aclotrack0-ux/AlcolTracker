import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { BACResult, SavedCustomDrink } from '@/types/bac';
import { 
  getBACResults, 
  saveBACResult, 
  deleteBACResult,
  getCustomDrinks,
  saveCustomDrink as saveCustomDrinkToStorage,
  deleteCustomDrink as deleteCustomDrinkFromStorage,
} from '@/services/storage';

interface BACDataContextType {
  bacResults: BACResult[];
  customDrinks: SavedCustomDrink[];
  addBACResult: (result: BACResult) => Promise<void>;
  removeBACResult: (id: string) => Promise<void>;
  addCustomDrink: (drink: SavedCustomDrink) => Promise<void>;
  removeCustomDrink: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

export const BACDataContext = createContext<BACDataContextType | undefined>(undefined);

export function BACDataProvider({ children }: { children: ReactNode }) {
  const [bacResults, setBacResults] = useState<BACResult[]>([]);
  const [customDrinks, setCustomDrinks] = useState<SavedCustomDrink[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [results, drinks] = await Promise.all([
        getBACResults(),
        getCustomDrinks(),
      ]);
      setBacResults(results.sort((a, b) => b.timestamp - a.timestamp));
      setCustomDrinks(drinks);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const addBACResult = async (result: BACResult) => {
    try {
      await saveBACResult(result);
      setBacResults(prev => [result, ...prev]);
    } catch (error) {
      console.error('Error adding BAC result:', error);
      throw error;
    }
  };

  const removeBACResult = async (id: string) => {
    try {
      await deleteBACResult(id);
      setBacResults(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error removing BAC result:', error);
      throw error;
    }
  };

  const addCustomDrink = async (drink: SavedCustomDrink) => {
    try {
      await saveCustomDrinkToStorage(drink);
      setCustomDrinks(prev => [...prev, drink]);
    } catch (error) {
      console.error('Error adding custom drink:', error);
      throw error;
    }
  };

  const removeCustomDrink = async (id: string) => {
    try {
      await deleteCustomDrinkFromStorage(id);
      setCustomDrinks(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error removing custom drink:', error);
      throw error;
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <BACDataContext.Provider 
      value={{ 
        bacResults, 
        customDrinks, 
        addBACResult, 
        removeBACResult, 
        addCustomDrink, 
        removeCustomDrink,
        refreshData,
      }}
    >
      {children}
    </BACDataContext.Provider>
  );
}