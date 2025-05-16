import RNFS from 'react-native-fs';
import { MODEL_CONFIG } from '../config/modelConfig';

export class ModelDownloader {
  private static instance: ModelDownloader;
  private downloadProgress: number = 0;

  private constructor() {}

  public static getInstance(): ModelDownloader {
    if (!ModelDownloader.instance) {
      ModelDownloader.instance = new ModelDownloader();
    }
    return ModelDownloader.instance;
  }

  public async downloadModel(modelPath: string): Promise<void> {
    try {
      const modelUrl = `https://huggingface.co/${MODEL_CONFIG.modelName}/resolve/main/model.onnx`;
      const tempPath = `${RNFS.CachesDirectoryPath}/model_temp.onnx`;

      // Download the model
      const downloadResult = await RNFS.downloadFile({
        fromUrl: modelUrl,
        toFile: tempPath,
        background: true,
        begin: (res) => {
          console.log('Download started:', res);
        },
        progress: (res) => {
          this.downloadProgress = res.bytesWritten / res.contentLength;
          console.log('Download progress:', this.downloadProgress);
        },
      }).promise;

      if (downloadResult.statusCode !== 200) {
        throw new Error(`Failed to download model: ${downloadResult.statusCode}`);
      }

      // Verify the downloaded file
      if (!await this.verifyModel(tempPath)) {
        throw new Error('Model verification failed');
      }

      // Move the file to the final location
      await RNFS.moveFile(tempPath, `${modelPath}/model.onnx`);

      // Clean up
      await RNFS.unlink(tempPath).catch(() => {});
    } catch (error) {
      console.error('Failed to download model:', error);
      throw error;
    }
  }

  public getDownloadProgress(): number {
    return this.downloadProgress;
  }

  private async verifyModel(modelPath: string): Promise<boolean> {
    try {
      const exists = await RNFS.exists(modelPath);
      if (!exists) return false;

      const stats = await RNFS.stat(modelPath);
      
      // Check if file size is reasonable (between 100MB and 2GB)
      if (stats.size < 100 * 1024 * 1024 || stats.size > 2 * 1024 * 1024 * 1024) {
        console.error('Invalid model file size:', stats.size);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to verify model:', error);
      return false;
    }
  }

  private async extractModel(archivePath: string, targetPath: string): Promise<void> {
    try {
      // TODO: Implement model extraction
      // This will involve:
      // 1. Extracting the downloaded archive
      // 2. Moving files to the correct location
      // 3. Cleaning up temporary files
      throw new Error('Model extraction not implemented');
    } catch (error) {
      console.error('Failed to extract model:', error);
      throw error;
    }
  }
} 