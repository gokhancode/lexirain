import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Settings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  showHints: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

const defaultSettings: Settings = {
  soundEnabled: true,
  hapticEnabled: true,
  showHints: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = '@lexirain_settings';

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Ensure all values are proper booleans (not strings)
          const sanitized: Settings = {
            soundEnabled: parsed.soundEnabled === true || parsed.soundEnabled === 'true',
            hapticEnabled: parsed.hapticEnabled === true || parsed.hapticEnabled === 'true',
            showHints: parsed.showHints === true || parsed.showHints === 'true',
          };
          setSettings(sanitized);
        }
      } catch (error) {
        console.log('Failed to load settings:', error);
      }
    };
    loadSettings();
  }, []);

  // Save settings to storage whenever they change
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings)).catch(console.log);
      return newSettings;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
