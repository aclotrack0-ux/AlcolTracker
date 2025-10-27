import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getBACColor } from '@/constants/colors';
import { useTheme } from '@/hooks/useTheme';

interface BACBarProps {
  bac: number;
  showValue?: boolean;
}

export default function BACBar({ bac, showValue = true }: BACBarProps) {
  const { colors } = useTheme();
  
  const getBarWidth = () => {
    const maxBAC = 3.0;
    const percentage = Math.min((bac / maxBAC) * 100, 100);
    return `${percentage}%`;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.barBackground, { backgroundColor: colors.border }]}>
        <View 
          style={[
            styles.barFill, 
            { 
              width: getBarWidth(), 
              backgroundColor: getBACColor(bac),
            }
          ]} 
        />
      </View>
      {showValue && (
        <Text style={[styles.bacValue, { color: colors.text }]}>
          {bac.toFixed(2)} g/L
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  barBackground: {
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    height: '100%',
    borderRadius: 10,
  },
  bacValue: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});