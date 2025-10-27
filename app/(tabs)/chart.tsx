import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { useBACData } from '@/hooks/useBACData';
import { BACResult } from '@/types/bac';

type FilterMode = 'all' | 'atZero' | 'afterTime';
type GenderFilter = 'all' | 'male' | 'female';

export default function ChartPage() {
  const insets = useSafeAreaInsets();
  const { colors, theme } = useTheme();
  const { t } = useLanguage();
  const { bacResults } = useBACData();

  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  const chartWidth = Math.max(1, Dimensions.get('window').width - 40);

  const filteredData = useMemo(() => {
    let data = bacResults;

    // Filter by gender
    if (genderFilter !== 'all') {
      data = data.filter(r => r.input.gender === genderFilter);
    }

    return data;
  }, [bacResults, genderFilter]);

  const chartData = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        labels: [],
        datasets: [{ data: [0] }],
      };
    }

    const labels = filteredData.slice(-10).map((r, i) => `${i + 1}`);
    
    if (filterMode === 'all') {
      const atZeroData = filteredData.slice(-10).map(r => r.bacAtZero);
      const afterTimeData = filteredData.slice(-10).map(r => r.bacAfterTime ?? r.bacAtZero);
      
      return {
        labels,
        datasets: [
          {
            data: atZeroData.length > 0 ? atZeroData : [0],
            color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
            strokeWidth: 3,
          },
          {
            data: afterTimeData.length > 0 ? afterTimeData : [0],
            color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`,
            strokeWidth: 3,
          },
        ],
        legend: [t('bacAtZero'), t('bacAfterTime')],
      };
    } else if (filterMode === 'atZero') {
      const atZeroData = filteredData.slice(-10).map(r => r.bacAtZero);
      return {
        labels,
        datasets: [{
          data: atZeroData.length > 0 ? atZeroData : [0],
          color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
          strokeWidth: 3,
        }],
        legend: [t('bacAtZero')],
      };
    } else {
      const afterTimeData = filteredData.slice(-10).map(r => r.bacAfterTime ?? r.bacAtZero);
      return {
        labels,
        datasets: [{
          data: afterTimeData.length > 0 ? afterTimeData : [0],
          color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`,
          strokeWidth: 3,
        }],
        legend: [t('bacAfterTime')],
      };
    }
  }, [filteredData, filterMode, t]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('chart')}
        </Text>
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
          <MaterialIcons 
            name={showFilters ? 'filter-list-off' : 'filter-list'} 
            size={28} 
            color={colors.primary} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {showFilters && (
          <View style={[styles.filtersCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.filterTitle, { color: colors.text }]}>
              {t('filterData')}
            </Text>

            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
                {t('filterData')}
              </Text>
              <View style={styles.filterButtons}>
                {(['all', 'atZero', 'afterTime'] as FilterMode[]).map(mode => (
                  <TouchableOpacity
                    key={mode}
                    style={[
                      styles.filterButton,
                      { borderColor: colors.border },
                      filterMode === mode && { backgroundColor: colors.primary },
                    ]}
                    onPress={() => setFilterMode(mode)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      { color: filterMode === mode ? '#FFFFFF' : colors.text }
                    ]}>
                      {t(mode === 'all' ? 'allData' : mode === 'atZero' ? 'onlyAtZero' : 'onlyAfterTime')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
                {t('filterByGender')}
              </Text>
              <View style={styles.filterButtons}>
                {(['all', 'male', 'female'] as GenderFilter[]).map(gender => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.filterButton,
                      { borderColor: colors.border },
                      genderFilter === gender && { backgroundColor: colors.secondary },
                    ]}
                    onPress={() => setGenderFilter(gender)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      { color: genderFilter === gender ? '#FFFFFF' : colors.text }
                    ]}>
                      {t(gender === 'all' ? 'allGenders' : gender)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {filteredData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="bar-chart" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('noData')}
            </Text>
          </View>
        ) : (
          <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
            <LineChart
              data={chartData}
              width={chartWidth}
              height={300}
              chartConfig={{
                backgroundColor: colors.card,
                backgroundGradientFrom: colors.card,
                backgroundGradientTo: colors.card,
                decimalPlaces: 2,
                color: (opacity = 1) => theme === 'light' 
                  ? `rgba(0, 0, 0, ${opacity})` 
                  : `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => theme === 'light'
                  ? `rgba(0, 0, 0, ${opacity})`
                  : `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: colors.primary,
                },
              }}
              bezier
              style={styles.chart}
            />
            
            {chartData.legend && (
              <View style={styles.legend}>
                {chartData.legend.map((label, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={[
                      styles.legendDot,
                      { backgroundColor: index === 0 ? '#FF6B6B' : '#4ECDC4' }
                    ]} />
                    <Text style={[styles.legendText, { color: colors.text }]}>
                      {label}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statsTitle, { color: colors.text }]}>
            {t('history')}
          </Text>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Total Results:
            </Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {filteredData.length}
            </Text>
          </View>
          {filteredData.length > 0 && (
            <>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Average BAC:
                </Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {(filteredData.reduce((sum, r) => sum + r.bacAtZero, 0) / filteredData.length).toFixed(2)} g/L
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Max BAC:
                </Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {Math.max(...filteredData.map(r => r.bacAtZero)).toFixed(2)} g/L
                </Text>
              </View>
            </>
          )}
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
  filtersCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chartCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});