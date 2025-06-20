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

export interface ModelResult {
  id: string;                 
  text: string;
  confidence: number;
  timestamp: number;         

  elapsedMs?: number;         
  raw?: unknown;              
  metadata?: Record<string, unknown>; 
  source?: {                 
    fileName?: string;
    uri?: string;
  };
  labels?: string[];         
}

export interface ModelState {

  isLoaded: boolean;
  isProcessing: boolean;
  currentModel: string | null;
  results: ModelResult[];
  error: string | null;


  progress?: number;          
  queueSize?: number;         /
  startedAt?: number;         
  endedAt?: number;
  modelVersion?: string;      
  device?: 'cpu' | 'gpu' | string;
  isCancelled?: boolean;
  lastUpdated?: number;       
}


export interface AppSettings {

  theme: 'light' | 'dark' | 'system'; 
  language: string;
  modelPath: string;

 
  autoSave?: boolean;                   
  confidenceThreshold?: number;         
  notifications?: { desktop: boolean; sound: boolean };
  recentModels?: string[];              
  hotkeys?: Record<string, string>;     
  analyticsOptIn?: boolean;             
  updateChannel?: 'stable' | 'beta';    
}
