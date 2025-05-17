export interface ModelResult {
  text: string;
  confidence: number;
  timestamp: number;
}

export interface ModelState {
  isLoaded: boolean;
  isProcessing: boolean;
  currentModel: string | null;
  results: ModelResult[];
  error: string | null;
}

export interface AppSettings {
  darkMode: boolean;
  language: string;
  modelPath: string;
} 