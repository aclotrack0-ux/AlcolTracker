import { useContext } from 'react';
import { BACDataContext } from '@/contexts/BACDataContext';

export function useBACData() {
  const context = useContext(BACDataContext);
  if (!context) {
    throw new Error('useBACData must be used within BACDataProvider');
  }
  return context;
}