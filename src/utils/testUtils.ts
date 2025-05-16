import RNFS from 'react-native-fs';
import { MODEL_CONFIG } from '../config/modelConfig';
import SmolVLMService from '../services/SmolVLMService';

export class TestUtils {
  private static instance: TestUtils;
  private smolVLMService: SmolVLMService;

  private constructor() {
    this.smolVLMService = SmolVLMService.getInstance();
  }

  public static getInstance(): TestUtils {
    if (!TestUtils.instance) {
      TestUtils.instance = new TestUtils();
    }
    return TestUtils.instance;
  }

  public async runTests(): Promise<void> {
    try {
      console.log('Starting tests...');

      // Test 1: Initialize service
      console.log('Test 1: Initializing service...');
      await this.smolVLMService.initialize();
      console.log('Service initialized successfully');

      // Test 2: Check model download
      console.log('Test 2: Checking model download...');
      const downloadProgress = this.smolVLMService.getDownloadProgress();
      console.log(`Download progress: ${downloadProgress * 100}%`);

      // Test 3: Process sample image
      console.log('Test 3: Processing sample image...');
      const sampleImagePath = `${RNFS.CachesDirectoryPath}/sample.jpg`;
      
      // Create a sample image if it doesn't exist
      if (!await RNFS.exists(sampleImagePath)) {
        console.log('Creating sample image...');
        // TODO: Create a sample image with handwritten text
        throw new Error('Sample image creation not implemented');
      }

      const result = await this.smolVLMService.processImage(sampleImagePath);
      console.log('Processing result:', result);

      // Test 4: Cleanup
      console.log('Test 4: Cleaning up...');
      await this.smolVLMService.cleanup();
      console.log('Cleanup completed');

      console.log('All tests completed successfully!');
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  }
} 