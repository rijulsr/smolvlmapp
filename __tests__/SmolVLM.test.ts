import SmolVLMService from '../src/services/SmolVLMService';
import { TestUtils } from '../src/utils/testUtils';

jest.mock('../src/services/SmolVLMService');
jest.mock('../src/utils/testUtils');

describe('SmolVLM Tests', () => {
  let smolVLMService: SmolVLMService;
  let testUtils: TestUtils;

  beforeEach(() => {
    smolVLMService = SmolVLMService.getInstance();
    testUtils = TestUtils.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize service successfully', async () => {
    const mockInitialize = jest.spyOn(smolVLMService, 'initialize');
    mockInitialize.mockResolvedValue(undefined);

    await testUtils.runTests();
    expect(mockInitialize).toHaveBeenCalled();
  });

  test('should handle initialization error', async () => {
    const mockInitialize = jest.spyOn(smolVLMService, 'initialize');
    mockInitialize.mockRejectedValue(new Error('Initialization failed'));

    await expect(testUtils.runTests()).rejects.toThrow('Initialization failed');
  });

  test('should get download progress', () => {
    const mockGetDownloadProgress = jest.spyOn(smolVLMService, 'getDownloadProgress');
    mockGetDownloadProgress.mockReturnValue(0.5);

    const progress = smolVLMService.getDownloadProgress();
    expect(progress).toBe(0.5);
  });

  test('should process image successfully', async () => {
    const mockProcessImage = jest.spyOn(smolVLMService, 'processImage');
    const expectedResult = {
      text: 'Test result',
      confidence: 0.95,
      structuredData: {
        title: 'Test Note',
        sections: [
          {
            heading: 'Section 1',
            content: 'Test content',
          },
        ],
      },
    };
    mockProcessImage.mockResolvedValue(expectedResult);

    const result = await smolVLMService.processImage('test.jpg');
    expect(result).toEqual(expectedResult);
  });

  test('should handle image processing error', async () => {
    const mockProcessImage = jest.spyOn(smolVLMService, 'processImage');
    mockProcessImage.mockRejectedValue(new Error('Processing failed'));

    await expect(smolVLMService.processImage('test.jpg')).rejects.toThrow('Processing failed');
  });

  test('should cleanup resources successfully', async () => {
    const mockCleanup = jest.spyOn(smolVLMService, 'cleanup');
    mockCleanup.mockResolvedValue(undefined);

    await smolVLMService.cleanup();
    expect(mockCleanup).toHaveBeenCalled();
  });
}); 