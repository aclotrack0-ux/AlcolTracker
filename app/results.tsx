import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { useBACData } from '@/hooks/useBACData';
import { BACResult } from '@/types/bac';
import BACBar from '@/components/BACBar';

export default function ResultsPage() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { addBACResult } = useBACData();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [saved, setSaved] = useState(false);

  const result: BACResult = params.result ? JSON.parse(params.result as string) : null;

  if (!result) {
    return null;
  }

  const handleSave = async () => {
    try {
      await addBACResult(result);
      setSaved(true);
      Alert.alert('', t('resultSaved'));
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  const handleNewCalculation = () => {
    router.push('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('results')}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* BAC at t=0 */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {t('bacAtZero')}
          </Text>
          <BACBar bac={result.bacAtZero} />
        </View>

        {/* BAC after time (if applicable) */}
        {result.bacAfterTime !== undefined && (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {t('bacAfterTime')}
            </Text>
            <BACBar bac={result.bacAfterTime} />
          </View>
        )}

        {/* Status Comment */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.statusContainer}>
            <MaterialIcons 
              name="info" 
              size={28} 
              color={colors.primary} 
              style={styles.statusIcon}
            />
            <Text style={[styles.statusText, { color: colors.text }]}>
              {t(result.statusComment)}
            </Text>
          </View>
        </View>

        {/* Time to Sober */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {t('timeToSober')}
          </Text>
          <View style={styles.timeToSoberContainer}>
            <MaterialIcons name="access-time" size={48} color={colors.secondary} />
            <Text style={[styles.timeToSoberText, { color: colors.text }]}>
              {result.timeToSober.toFixed(1)} {t('hoursShort')}
            </Text>
          </View>
        </View>

        {/* Calculation Details */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {t('calculate')}
          </Text>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="person" size={20} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.text }]}>
              {result.input.weight}kg • {t(result.input.gender)}
            </Text>
          </View>

          {result.input.predefinedDrinks.length > 0 && (
            <View style={styles.drinksSection}>
              <Text style={[styles.drinksTitle, { color: colors.textSecondary }]}>
                {t('predefinedDrinks')}:
              </Text>
              {result.input.predefinedDrinks.map((drink, index) => (
                <Text key={index} style={[styles.drinkItem, { color: colors.text }]}>
                  • {drink.count}x {t(drink.type)} ({drink.volumeMl}ml)
                </Text>
              ))}
            </View>
          )}

          {result.input.customDrinks.length > 0 && (
            <View style={styles.drinksSection}>
              <Text style={[styles.drinksTitle, { color: colors.textSecondary }]}>
                {t('customDrinks')}:
              </Text>
              {result.input.customDrinks.map((drink, index) => (
                <Text key={index} style={[styles.drinkItem, { color: colors.text }]}>
                  • {drink.count}x {drink.name} ({drink.volumeMl}ml, {drink.alcoholPercentage}%)
                </Text>
              ))}
            </View>
          )}

          {result.input.timeElapsed !== undefined && (
            <View style={styles.detailRow}>
              <MaterialIcons name="timer" size={20} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {t('timeElapsed')}: {result.input.timeElapsed} {t(result.input.timeUnit || 'minutes')}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button, 
              { backgroundColor: saved ? colors.success : colors.secondary }
            ]}
            onPress={handleSave}
            disabled={saved}
          >
            <MaterialIcons 
              name={saved ? 'check' : 'save'} 
              size={24} 
              color="#FFFFFF" 
            />
            <Text style={styles.buttonText}>
              {saved ? t('resultSaved') : t('saveResult')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleNewCalculation}
          >
            <MaterialIcons name="refresh" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>{t('newCalculation')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  statusText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  timeToSoberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 12,
  },
  timeToSoberText: {
    fontSize: 32,
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
  },
  drinksSection: {
    marginTop: 12,
    marginBottom: 12,
  },
  drinksTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  drinkItem: {
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 4,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    gap: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});