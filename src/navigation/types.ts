import { LanguageKey } from '../data/vocabulary';

export type RootStackParamList = {
  Home: undefined;
  LanguageSelect: undefined;
  Game: { language: LanguageKey };
  Settings: undefined;
  HowToPlay: undefined;
};
