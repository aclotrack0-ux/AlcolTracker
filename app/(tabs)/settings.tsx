import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { Language } from '@/types/bac';

type InfoSection = 'aboutBAC' | 'howItWorks' | 'curiosities' | 'privacy' | 'terms';

export default function SettingsPage() {
  const insets = useSafeAreaInsets();
  const { colors, theme, setTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<InfoSection | null>(null);

  const languages: { code: Language; name: string }[] = [
    { code: 'it', name: t('italian') },
    { code: 'en', name: t('english') },
    { code: 'fr', name: t('french') },
    { code: 'es', name: t('spanish') },
    { code: 'de', name: t('german') },
  ];

  const infoSections: InfoSection[] = ['aboutBAC', 'howItWorks', 'curiosities', 'privacy', 'terms'];

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setShowLanguageModal(false);
  };

  const handleInfoPress = (section: InfoSection) => {
    setSelectedInfo(section);
    setShowInfoModal(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('settings')}
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Card */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {t('theme')}
          </Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                { borderColor: colors.border },
                theme === 'light' && { backgroundColor: colors.primary },
              ]}
              onPress={() => setTheme('light')}
            >
              <MaterialIcons 
                name="wb-sunny" 
                size={24} 
                color={theme === 'light' ? '#FFFFFF' : colors.text} 
              />
              <Text style={[
                styles.themeButtonText,
                { color: theme === 'light' ? '#FFFFFF' : colors.text }
              ]}>
                {t('light')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeButton,
                { borderColor: colors.border },
                theme === 'dark' && { backgroundColor: colors.primary },
              ]}
              onPress={() => setTheme('dark')}
            >
              <MaterialIcons 
                name="nightlight-round" 
                size={24} 
                color={theme === 'dark' ? '#FFFFFF' : colors.text} 
              />
              <Text style={[
                styles.themeButtonText,
                { color: theme === 'dark' ? '#FFFFFF' : colors.text }
              ]}>
                {t('dark')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Language Card */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {t('language')}
          </Text>
          <TouchableOpacity
            style={[styles.selectButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setShowLanguageModal(true)}
          >
            <Text style={[styles.selectButtonText, { color: colors.text }]}>
              {languages.find(l => l.code === language)?.name || 'Language'}
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Information Card */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {t('information')}
          </Text>
          {infoSections.map(section => (
            <TouchableOpacity
              key={section}
              style={[styles.infoButton, { borderBottomColor: colors.border }]}
              onPress={() => handleInfoPress(section)}
            >
              <Text style={[styles.infoButtonText, { color: colors.text }]}>
                {t(section)}
              </Text>
              <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Language Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('language')}
              </Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {languages.map(lang => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  { borderBottomColor: colors.border },
                  language === lang.code && { backgroundColor: colors.surface },
                ]}
                onPress={() => handleLanguageSelect(lang.code)}
              >
                <Text style={[styles.languageOptionText, { color: colors.text }]}>
                  {lang.name}
                </Text>
                {language === lang.code && (
                  <MaterialIcons name="check" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Info Modal */}
      <Modal
        visible={showInfoModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {selectedInfo ? t(selectedInfo) : ''}
              </Text>
              <TouchableOpacity onPress={() => setShowInfoModal(false)}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.infoContent}>
              <Text style={[styles.infoText, { color: colors.text }]}>
                {selectedInfo ? t(`${selectedInfo}Text`) : ''}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
  },
  themeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  infoButtonText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  languageOptionText: {
    fontSize: 16,
  },
  infoContent: {
    padding: 20,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
  },
});