import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { MODEL_CONFIG, MODEL_PATHS } from '../config/modelConfig';
import { ONNXUtils } from '../utils/onnxUtils';
import { ModelDownloader } from '../utils/modelDownloader';

interface ProcessedResult {
  text: string;
  confidence: number;
  structuredData?: {
    title?: string;
    sections?: Array<{
      heading: string;
      content: string;
    }>;
  };
}

class SmolVLMService {
  private static instance: SmolVLMService;
  private modelLoaded: boolean = false;
  private modelPath: string;
  private cachePath: string;
  private onnxUtils: ONNXUtils;
  private modelDownloader: ModelDownloader;

  private constructor() {
    const platform = Platform.OS;
    this.modelPath = MODEL_PATHS[platform].modelPath;
    this.cachePath = MODEL_PATHS[platform].cachePath;
    this.onnxUtils = ONNXUtils.getInstance();
    this.modelDownloader = ModelDownloader.getInstance();
  }

  public static getInstance(): SmolVLMService {
    if (!SmolVLMService.instance) {
      SmolVLMService.instance = new SmolVLMService();
    }
    return SmolVLMService.instance;
  }

  public async initialize(): Promise<void> {
    try {
      // Create necessary directories
      await this.ensureDirectoriesExist();
      
      // Download and setup model if not exists
      if (!await this.isModelDownloaded()) {
        await this.modelDownloader.downloadModel(this.modelPath);
      }

      // Initialize model
      await this.onnxUtils.loadModel(`${this.modelPath}/model.onnx`);
      
      this.modelLoaded = true;
    } catch (error) {
      console.error('Failed to initialize SmolVLM:', error);
      throw error;
    }
  }

  private async ensureDirectoriesExist(): Promise<void> {
    try {
      await RNFS.mkdir(this.modelPath);
      await RNFS.mkdir(this.cachePath);
    } catch (error) {
      console.error('Failed to create directories:', error);
      throw error;
    }
  }

  private async isModelDownloaded(): Promise<boolean> {
    try {
      const exists = await RNFS.exists(`${this.modelPath}/model.onnx`);
      return exists;
    } catch (error) {
      console.error('Failed to check model existence:', error);
      return false;
    }
  }

  public async processImage(imagePath: string): Promise<ProcessedResult> {
    if (!this.modelLoaded) {
      throw new Error('Model not initialized');
    }

    try {
      // Read image file
      const imageData = await RNFS.readFile(imagePath, 'base64');
      
      // Preprocess image
      const processedImage = await this.onnxUtils.preprocessImage(imageData);
      
      // Run inference
      const result = await this.onnxUtils.runInference(processedImage);
      
      return result;
    } catch (error) {
      console.error('Failed to process image:', error);
      throw error;
    }
  }

  public async cleanup(): Promise<void> {
    try {
      await this.onnxUtils.cleanup();
      this.modelLoaded = false;
    } catch (error) {
      console.error('Failed to cleanup:', error);
      throw error;
    }
  }

  public getDownloadProgress(): number {
    return this.modelDownloader.getDownloadProgress();
  }
}

export default SmolVLMService; 