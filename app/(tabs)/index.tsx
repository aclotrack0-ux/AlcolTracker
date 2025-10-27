import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { useBACData } from '@/hooks/useBACData';
import { PREDEFINED_DRINKS } from '@/constants/drinks';
import { PredefinedDrink, CustomDrink, BACInput } from '@/types/bac';
import { calculateBAC, validateBACInput } from '@/services/bacCalculator';
import DrinkCounter from '@/components/DrinkCounter';

export default function CalculatePage() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { customDrinks, addCustomDrink } = useBACData();
  const router = useRouter();

  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [predefinedCounts, setPredefinedCounts] = useState<Record<string, number>>({});
  const [customCounts, setCustomCounts] = useState<Record<string, number>>({});
  const [timeElapsed, setTimeElapsed] = useState('');
  const [timeUnit, setTimeUnit] = useState<'minutes' | 'hours'>('minutes');
  
  // Custom drink form
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPercentage, setCustomPercentage] = useState('');
  const [customVolume, setCustomVolume] = useState('');
  const [saveCustom, setSaveCustom] = useState(false);

  useEffect(() => {
    // Initialize predefined drink counts
    const counts: Record<string, number> = {};
    PREDEFINED_DRINKS.forEach(drink => {
      counts[drink.type] = 0;
    });
    setPredefinedCounts(counts);
  }, []);

  useEffect(() => {
    // Initialize custom drink counts
    const counts: Record<string, number> = {};
    customDrinks.forEach(drink => {
      counts[drink.id] = 0;
    });
    setCustomCounts(counts);
  }, [customDrinks]);

  const handleCalculate = () => {
    // Prepare input data
    const predefinedDrinksList: PredefinedDrink[] = PREDEFINED_DRINKS
      .filter(drink => predefinedCounts[drink.type] > 0)
      .map(drink => ({
        ...drink,
        count: predefinedCounts[drink.type],
      }));

    const customDrinksList: CustomDrink[] = customDrinks
      .filter(drink => customCounts[drink.id] > 0)
      .map(drink => ({
        ...drink,
        count: customCounts[drink.id],
      }));

    const input: Partial<BACInput> = {
      weight: parseFloat(weight),
      gender: gender as 'male' | 'female',
      predefinedDrinks: predefinedDrinksList,
      customDrinks: customDrinksList,
      timeElapsed: timeElapsed ? parseFloat(timeElapsed) : undefined,
      timeUnit,
    };

    // Validate input
    const validation = validateBACInput(input);
    if (!validation.valid) {
      Alert.alert('Error', t(validation.error!));
      return;
    }

    // Calculate BAC
    try {
      const result = calculateBAC(input as BACInput);
      const fullResult = {
        ...result,
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
      };

      // Navigate to results page
      router.push({
        pathname: '/results',
        params: { result: JSON.stringify(fullResult) },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to calculate BAC');
      console.error(error);
    }
  };

  const handleAddCustomDrink = async () => {
    if (!customName || !customPercentage || !customVolume) {
      Alert.alert('Error', t('invalidDrinkData'));
      return;
    }

    const newDrink = {
      id: Date.now().toString(),
      name: customName,
      alcoholPercentage: parseFloat(customPercentage),
      volumeMl: parseFloat(customVolume),
      count: 1,
    };

    if (saveCustom) {
      try {
        await addCustomDrink(newDrink);
      } catch (error) {
        console.error('Error saving custom drink:', error);
      }
    }

    // Reset form
    setCustomName('');
    setCustomPercentage('');
    setCustomVolume('');
    setSaveCustom(false);
    setShowCustomForm(false);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.appName, { color: colors.primary }]}>
              {t('appName')}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {t('appSubtitle')}
            </Text>
          </View>

          {/* User Info Card */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              placeholder={t('weight')}
              placeholderTextColor={colors.textSecondary}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />

            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  { borderColor: colors.border },
                  gender === 'male' && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => setGender('male')}
              >
                <MaterialIcons 
                  name="male" 
                  size={24} 
                  color={gender === 'male' ? '#FFFFFF' : colors.text} 
                />
                <Text style={[
                  styles.genderText, 
                  { color: gender === 'male' ? '#FFFFFF' : colors.text }
                ]}>
                  {t('male')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderButton,
                  { borderColor: colors.border },
                  gender === 'female' && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => setGender('female')}
              >
                <MaterialIcons 
                  name="female" 
                  size={24} 
                  color={gender === 'female' ? '#FFFFFF' : colors.text} 
                />
                <Text style={[
                  styles.genderText, 
                  { color: gender === 'female' ? '#FFFFFF' : colors.text }
                ]}>
                  {t('female')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Predefined Drinks */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('predefinedDrinks')}
            </Text>
            {PREDEFINED_DRINKS.map(drink => (
              <View key={drink.type} style={styles.drinkRow}>
                <View style={styles.drinkInfo}>
                  <Text style={[styles.drinkName, { color: colors.text }]}>
                    {t(drink.type)}
                  </Text>
                  <Text style={[styles.drinkDetails, { color: colors.textSecondary }]}>
                    {drink.alcoholPercentage}% • {drink.volumeMl}ml
                  </Text>
                </View>
                <DrinkCounter
                  count={predefinedCounts[drink.type] || 0}
                  onIncrement={() => setPredefinedCounts(prev => ({
                    ...prev,
                    [drink.type]: (prev[drink.type] || 0) + 1,
                  }))}
                  onDecrement={() => setPredefinedCounts(prev => ({
                    ...prev,
                    [drink.type]: Math.max(0, (prev[drink.type] || 0) - 1),
                  }))}
                />
              </View>
            ))}
          </View>

          {/* Custom Drinks */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('customDrinks')}
            </Text>
            
            {customDrinks.map(drink => (
              <View key={drink.id} style={styles.drinkRow}>
                <View style={styles.drinkInfo}>
                  <Text style={[styles.drinkName, { color: colors.text }]}>
                    {drink.name}
                  </Text>
                  <Text style={[styles.drinkDetails, { color: colors.textSecondary }]}>
                    {drink.alcoholPercentage}% • {drink.volumeMl}ml
                  </Text>
                </View>
                <DrinkCounter
                  count={customCounts[drink.id] || 0}
                  onIncrement={() => setCustomCounts(prev => ({
                    ...prev,
                    [drink.id]: (prev[drink.id] || 0) + 1,
                  }))}
                  onDecrement={() => setCustomCounts(prev => ({
                    ...prev,
                    [drink.id]: Math.max(0, (prev[drink.id] || 0) - 1),
                  }))}
                />
              </View>
            ))}

            {!showCustomForm ? (
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.secondary }]}
                onPress={() => setShowCustomForm(true)}
              >
                <MaterialIcons name="add" size={24} color="#FFFFFF" />
                <Text style={styles.addButtonText}>{t('addCustomDrink')}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.customForm}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                  placeholder={t('drinkName')}
                  placeholderTextColor={colors.textSecondary}
                  value={customName}
                  onChangeText={setCustomName}
                />
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                  placeholder={t('alcoholPercentage')}
                  placeholderTextColor={colors.textSecondary}
                  value={customPercentage}
                  onChangeText={setCustomPercentage}
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                  placeholder={t('volumeMl')}
                  placeholderTextColor={colors.textSecondary}
                  value={customVolume}
                  onChangeText={setCustomVolume}
                  keyboardType="numeric"
                />
                
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setSaveCustom(!saveCustom)}
                >
                  <MaterialIcons 
                    name={saveCustom ? 'check-box' : 'check-box-outline-blank'} 
                    size={24} 
                    color={colors.primary} 
                  />
                  <Text style={[styles.checkboxText, { color: colors.text }]}>
                    {t('saveCustomDrink')}
                  </Text>
                </TouchableOpacity>

                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={[styles.formButton, { backgroundColor: colors.border }]}
                    onPress={() => {
                      setShowCustomForm(false);
                      setCustomName('');
                      setCustomPercentage('');
                      setCustomVolume('');
                      setSaveCustom(false);
                    }}
                  >
                    <Text style={[styles.formButtonText, { color: colors.text }]}>
                      {t('cancel')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.formButton, { backgroundColor: colors.secondary }]}
                    onPress={handleAddCustomDrink}
                  >
                    <Text style={styles.formButtonText}>{t('addCustomDrink')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Time Elapsed (Optional) */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('timeElapsed')}
            </Text>
            
            <View style={styles.timeContainer}>
              <TextInput
                style={[styles.timeInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                value={timeElapsed}
                onChangeText={setTimeElapsed}
                keyboardType="numeric"
              />
              
              <View style={styles.timeUnitButtons}>
                <TouchableOpacity
                  style={[
                    styles.timeUnitButton,
                    { borderColor: colors.border },
                    timeUnit === 'minutes' && { backgroundColor: colors.secondary },
                  ]}
                  onPress={() => setTimeUnit('minutes')}
                >
                  <Text style={[
                    styles.timeUnitText,
                    { color: timeUnit === 'minutes' ? '#FFFFFF' : colors.text }
                  ]}>
                    {t('minutes')}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.timeUnitButton,
                    { borderColor: colors.border },
                    timeUnit === 'hours' && { backgroundColor: colors.secondary },
                  ]}
                  onPress={() => setTimeUnit('hours')}
                >
                  <Text style={[
                    styles.timeUnitText,
                    { color: timeUnit === 'hours' ? '#FFFFFF' : colors.text }
                  ]}>
                    {t('hours')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Calculate Button */}
          <TouchableOpacity
            style={[styles.calculateButton, { backgroundColor: colors.primary }]}
            onPress={handleCalculate}
          >
            <MaterialIcons name="calculate" size={24} color="#FFFFFF" />
            <Text style={styles.calculateButtonText}>{t('calculate')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
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
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  genderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  drinkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  drinkInfo: {
    flex: 1,
  },
  drinkName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  drinkDetails: {
    fontSize: 14,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  customForm: {
    marginTop: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  checkboxText: {
    fontSize: 14,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  formButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  timeInput: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  timeUnitButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  timeUnitButton: {
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeUnitText: {
    fontSize: 14,
    fontWeight: '600',
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    borderRadius: 16,
    gap: 12,
    marginTop: 8,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});