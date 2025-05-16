export const MODEL_CONFIG = {
  modelName: 'HuggingFaceTB/SmolVLM-Instruct',
  modelSize: '1.7B',
  maxInputLength: 512,
  maxOutputLength: 256,
  temperature: 0.7,
  topP: 0.9,
  cacheDir: 'model_cache',
  quantized: true,
  imageSize: {
    width: 384,
    height: 384,
  },
};

export const MODEL_PATHS = {
  android: {
    modelPath: 'android/app/src/main/assets/model',
    cachePath: 'android/app/src/main/assets/cache',
  },
  ios: {
    modelPath: 'ios/model',
    cachePath: 'ios/cache',
  },
}; 