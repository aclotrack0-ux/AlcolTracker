import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

interface DrinkCounterProps {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function DrinkCounter({ count, onIncrement, onDecrement }: DrinkCounterProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={onDecrement}
        disabled={count === 0}
      >
        <MaterialIcons name="remove" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <View style={[styles.countContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.countText, { color: colors.text }]}>{count}</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={onIncrement}
      >
        <MaterialIcons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countContainer: {
    minWidth: 50,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  countText: {
    fontSize: 18,
    fontWeight: '600',
  },
});