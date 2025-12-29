import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Switch,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CloudBackground } from '../components/CloudBackground';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';
import { RootStackParamList } from '../navigation/types';
import { useSettings } from '../context/SettingsContext';

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

interface SettingRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
  showArrow?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  onPress,
  showArrow,
}) => {
  const content = (
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}>
        <Text style={styles.settingIconText}>{icon}</Text>
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {onValueChange !== undefined && value !== undefined && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.text.muted, true: colors.rain.dropletLight }}
          thumbColor={value ? colors.rain.droplet : colors.background.card}
        />
      )}
      {showArrow && <Text style={styles.settingArrow}>→</Text>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { settings, updateSetting } = useSettings();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <CloudBackground variant="day">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        <Animated.ScrollView
          style={[
            styles.scrollView,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Game Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Game</Text>
            <View style={styles.card}>
              <SettingRow
                icon="🔊"
                title="Sound Effects"
                subtitle="Play sounds for correct/wrong answers"
                value={settings.soundEnabled}
                onValueChange={(value) => updateSetting('soundEnabled', value)}
              />
              <View style={styles.divider} />
              <SettingRow
                icon="📳"
                title="Haptic Feedback"
                subtitle="Vibrate on interactions"
                value={settings.hapticEnabled}
                onValueChange={(value) => updateSetting('hapticEnabled', value)}
              />
              <View style={styles.divider} />
              <SettingRow
                icon="💡"
                title="Show Hints"
                subtitle="Show correct translation when missed"
                value={settings.showHints}
                onValueChange={(value) => updateSetting('showHints', value)}
              />
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.card}>
              <SettingRow
                icon="📖"
                title="How to Play"
                onPress={() => navigation.navigate('HowToPlay')}
                showArrow
              />
            </View>
          </View>

          {/* Version Info */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>LexiRain v1.0.0</Text>
            <Text style={styles.versionSubtext}>Made with 💙 for language learners</Text>
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </CloudBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.text.primary,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.medium,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary.skyLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingIconText: {
    fontSize: 20,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  settingSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  settingArrow: {
    fontSize: 18,
    color: colors.text.muted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.primary.skyLight,
    marginLeft: 68,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  versionText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontWeight: typography.weights.medium,
  },
  versionSubtext: {
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
});
