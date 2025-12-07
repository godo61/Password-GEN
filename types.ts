export interface PasswordEntry {
  id: string;
  value: string;
  createdAt: number;
  strength: 'Débil' | 'Media' | 'Fuerte' | 'Muy Fuerte';
  isFavorite: boolean;
}

export interface GeneratorSettings {
  length: number;
  useUppercase: boolean;
  useLowercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  useAmbiguous: boolean; // Exclude l, 1, I, O, 0
  easyTyping: boolean; // Optimize for QWERTY flow
}

export interface AppState {
  history: PasswordEntry[];
  settings: GeneratorSettings;
  darkMode: boolean;
}
