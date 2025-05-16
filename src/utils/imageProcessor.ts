import { MODEL_CONFIG } from '../config/modelConfig';
import ImageManipulator from 'react-native-image-manipulator';

interface ImageData {
  data: Float32Array;
  width: number;
  height: number;
}

export class ImageProcessor {
  private static instance: ImageProcessor;

  private constructor() {}

  public static getInstance(): ImageProcessor {
    if (!ImageProcessor.instance) {
      ImageProcessor.instance = new ImageProcessor();
    }
    return ImageProcessor.instance;
  }

  public async preprocessImage(base64Image: string): Promise<ImageData> {
    try {
      // Decode base64 image
      const imageData = await this.decodeBase64Image(base64Image);
      
      // Resize image
      const resizedImage = await this.resizeImage(imageData);
      
      // Normalize pixels
      const normalizedData = this.normalizePixels(resizedImage);
      
      return {
        data: normalizedData,
        width: MODEL_CONFIG.imageSize.width,
        height: MODEL_CONFIG.imageSize.height,
      };
    } catch (error) {
      console.error('Failed to preprocess image:', error);
      throw error;
    }
  }

  private async decodeBase64Image(base64Image: string): Promise<ImageData> {
    try {
      const manipResult = await ImageManipulator.manipulate(
        `data:image/jpeg;base64,${base64Image}`,
        [],
        { base64: true }
      );

      // Convert base64 to Uint8Array
      const binaryString = atob(manipResult.base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      return {
        data: new Float32Array(bytes),
        width: manipResult.width,
        height: manipResult.height,
      };
    } catch (error) {
      console.error('Failed to decode base64 image:', error);
      throw error;
    }
  }

  private async resizeImage(imageData: ImageData): Promise<ImageData> {
    try {
      const manipResult = await ImageManipulator.manipulate(
        `data:image/jpeg;base64,${imageData.data}`,
        [
          {
            resize: {
              width: MODEL_CONFIG.imageSize.width,
              height: MODEL_CONFIG.imageSize.height,
            },
          },
        ],
        { base64: true }
      );

      // Convert base64 to Uint8Array
      const binaryString = atob(manipResult.base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      return {
        data: new Float32Array(bytes),
        width: manipResult.width,
        height: manipResult.height,
      };
    } catch (error) {
      console.error('Failed to resize image:', error);
      throw error;
    }
  }

  private normalizePixels(imageData: ImageData): Float32Array {
    try {
      const normalizedData = new Float32Array(imageData.data.length);
      
      // Normalize pixel values to [0, 1]
      for (let i = 0; i < imageData.data.length; i++) {
        normalizedData[i] = imageData.data[i] / 255.0;
      }

      return normalizedData;
    } catch (error) {
      console.error('Failed to normalize pixels:', error);
      throw error;
    }
  }
} 