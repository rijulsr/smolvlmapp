import { MODEL_CONFIG } from '../config/modelConfig';
import * as ort from 'onnxruntime-react-native';
import { ImageProcessor } from './imageProcessor';

interface ImageData {
  data: Float32Array;
  width: number;
  height: number;
}

export class ONNXUtils {
  private static instance: ONNXUtils;
  private session: ort.InferenceSession | null = null;
  private imageProcessor: ImageProcessor;

  private constructor() {
    this.imageProcessor = ImageProcessor.getInstance();
  }

  public static getInstance(): ONNXUtils {
    if (!ONNXUtils.instance) {
      ONNXUtils.instance = new ONNXUtils();
    }
    return ONNXUtils.instance;
  }

  public async loadModel(modelPath: string): Promise<void> {
    try {
      const options: ort.InferenceSession.SessionOptions = {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all',
      };

      this.session = await ort.InferenceSession.create(modelPath, options);
    } catch (error) {
      console.error('Failed to load ONNX model:', error);
      throw error;
    }
  }

  public async preprocessImage(imageData: string): Promise<ImageData> {
    try {
      return await this.imageProcessor.preprocessImage(imageData);
    } catch (error) {
      console.error('Failed to preprocess image:', error);
      throw error;
    }
  }

  public async runInference(imageData: ImageData): Promise<{
    text: string;
    confidence: number;
    structuredData?: any;
  }> {
    if (!this.session) {
      throw new Error('Model not loaded');
    }

    try {
      // Prepare input tensor
      const inputTensor = new ort.Tensor(
        'float32',
        imageData.data,
        [1, 3, imageData.height, imageData.width]
      );

      // Run inference
      const feeds = { input: inputTensor };
      const outputMap = await this.session.run(feeds);
      
      // Process output
      const output = outputMap.output;
      
      // TODO: Implement proper output processing
      // This will involve:
      // 1. Decoding the model output
      // 2. Extracting text and confidence
      // 3. Structuring the data

      return {
        text: 'Processed text will appear here',
        confidence: 0.95,
        structuredData: {
          title: 'Sample Note',
          sections: [
            {
              heading: 'Section 1',
              content: 'Content of section 1',
            },
          ],
        },
      };
    } catch (error) {
      console.error('Failed to run inference:', error);
      throw error;
    }
  }

  public async cleanup(): Promise<void> {
    try {
      if (this.session) {
        await this.session.release();
        this.session = null;
      }
    } catch (error) {
      console.error('Failed to cleanup ONNX resources:', error);
      throw error;
    }
  }
} 