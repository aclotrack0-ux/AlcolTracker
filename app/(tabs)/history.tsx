import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { useBACData } from '@/hooks/useBACData';
import BACBar from '@/components/BACBar';
import { BACResult } from '@/types/bac';

export default function HistoryPage() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { bacResults, removeBACResult } = useBACData();

  const handleDelete = (id: string) => {
    Alert.alert(
      t('deleteConfirm'),
      '',
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('delete'), 
          style: 'destructive',
          onPress: async () => {
            try {
              await removeBACResult(id);
            } catch (error) {
              console.error('Error deleting result:', error);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: BACResult }) => (
    <View style={[styles.resultCard, { backgroundColor: colors.card }]}>
      <View style={styles.resultHeader}>
        <View style={styles.resultInfo}>
          <Text style={[styles.resultDate, { color: colors.text }]}>
            {item.date}
          </Text>
          <Text style={[styles.resultStatus, { color: colors.textSecondary }]}>
            {t(item.statusComment)}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <MaterialIcons name="delete" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.bacSection}>
        <Text style={[styles.bacLabel, { color: colors.textSecondary }]}>
          {t('bacAtZero')}
        </Text>
        <BACBar bac={item.bacAtZero} />
      </View>

      {item.bacAfterTime !== undefined && (
        <View style={styles.bacSection}>
          <Text style={[styles.bacLabel, { color: colors.textSecondary }]}>
            {t('bacAfterTime')}
          </Text>
          <BACBar bac={item.bacAfterTime} />
        </View>
      )}

      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <MaterialIcons name="person" size={20} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.text }]}>
            {item.input.weight}kg • {t(item.input.gender)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialIcons name="timer" size={20} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.text }]}>
            {t('timeToSober')}: {item.timeToSober.toFixed(1)} {t('hoursShort')}
          </Text>
        </View>

        {item.input.predefinedDrinks.length > 0 && (
          <View style={styles.drinksSection}>
            <Text style={[styles.drinksTitle, { color: colors.textSecondary }]}>
              {t('predefinedDrinks')}:
            </Text>
            {item.input.predefinedDrinks.map((drink, index) => (
              <Text key={index} style={[styles.drinkItem, { color: colors.text }]}>
                • {drink.count}x {t(drink.type)} ({drink.volumeMl}ml)
              </Text>
            ))}
          </View>
        )}

        {item.input.customDrinks.length > 0 && (
          <View style={styles.drinksSection}>
            <Text style={[styles.drinksTitle, { color: colors.textSecondary }]}>
              {t('customDrinks')}:
            </Text>
            {item.input.customDrinks.map((drink, index) => (
              <Text key={index} style={[styles.drinkItem, { color: colors.text }]}>
                • {drink.count}x {drink.name} ({drink.volumeMl}ml, {drink.alcoholPercentage}%)
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('history')}
        </Text>
      </View>

      {bacResults.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="history" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {t('noHistory')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={bacResults}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  resultCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  resultInfo: {
    flex: 1,
  },
  resultDate: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultStatus: {
    fontSize: 14,
  },
  bacSection: {
    marginBottom: 16,
  },
  bacLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  detailsSection: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
  },
  drinksSection: {
    marginTop: 12,
  },
  drinksTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  drinkItem: {
    fontSize: 13,
    marginLeft: 8,
    marginBottom: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});