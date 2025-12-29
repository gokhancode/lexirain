import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  HomeScreen,
  LanguageSelectScreen,
  GameScreen,
  SettingsScreen,
  HowToPlayScreen,
} from './src/screens';
import { RootStackParamList } from './src/navigation/types';
import { SettingsProvider } from './src/context/SettingsContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SettingsProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
          <Stack.Screen
            name="Game"
            component={GameScreen}
            options={{
              animation: 'fade',
              gestureEnabled: false,
            }}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="HowToPlay" component={HowToPlayScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SettingsProvider>
  );
}
