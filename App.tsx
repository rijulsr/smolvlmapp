import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import {useIsFocused} from '@react-navigation/native';
import SmolVLMService from './src/services/SmolVLMService';
import ResultsScreen from './src/screens/ResultsScreen';

 
interface ProcessedResult {
  id: string;
  text: string;
  confidence: number;
  timestamp: number;
  elapsedMs?: number;
  structuredData?: {
    title?: string;
    sections?: Array<{
      heading: string;
      content: string;
    }>;
  };
}


const App: React.FC = () => {
  const isFocused = useIsFocused();
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);

  
  const smolVLMService = useMemo(() => SmolVLMService.getInstance(), []);

  
  const [hasPermission, setHasPermission] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedResult | null>(null);

 
  const getCameraPermission = useCallback(async () => {
    const current = await Camera.getCameraPermissionStatus();
    if (current !== 'authorized') {
      const updated = await Camera.requestCameraPermission();
      setHasPermission(updated === 'authorized');
    } else {
      setHasPermission(true);
    }
  }, []);

 
  const initialiseModel = useCallback(async () => {
    try {
      await smolVLMService.initialize();
    } catch (err) {
      Alert.alert('Model error', 'Failed to initialise VLM');
      console.error(err);
    }
  }, [smolVLMService]);

  
  useEffect(() => {
    getCameraPermission();
    initialiseModel();
  }, [getCameraPermission, initialiseModel]);

  
  const safeUnlink = async (path: string) => {
    try {
      await RNFS.unlink(path);
    } catch {
    
    }
  };

  const handleCapture = useCallback(async () => {
    if (!device || !cameraRef.current) return;

    setIsProcessing(true);
    const startedAt = Date.now();

    try {
      const photo = await cameraRef.current.takePhoto({qualityPrioritization: 'quality'});
      if (!photo?.path) throw new Error('Invalid photo response');

      const tmpPath = `${RNFS.CachesDirectoryPath}/capt_${Date.now()}.jpg`;
      await RNFS.copyFile(photo.path, tmpPath);

      const processed = await smolVLMService.processImage(tmpPath);
      const elapsedMs = Date.now() - startedAt;

      setResult({
        ...processed,
        id: `${Date.now()}`,
        timestamp: Date.now(),
        elapsedMs,
      });

      safeUnlink(tmpPath);
    } catch (err) {
      Alert.alert('Capture error', 'Failed to analyse image');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [device, smolVLMService]);

  
  const onRetry = () => setResult(null);

  
  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.info}>Camera permission is required.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={getCameraPermission}>
          <Text style={styles.btnText}>Grant permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (result) {
    return (
      <ResultsScreen
        text={result.text}
        confidence={result.confidence}
        structuredData={result.structuredData}
        onRetry={onRetry}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {device && isFocused && (
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive
          photo
        />
      )}

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.shutter, isProcessing && styles.shutterDisabled]}
          onPress={handleCapture}
          disabled={isProcessing}>
          {isProcessing ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.btnText}>Take photo</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'black'},
  centered: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  info: {color: 'white', marginBottom: 12},
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  shutter: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 50,
  },
  shutterDisabled: {backgroundColor: '#666'},
  primaryBtn: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
  },
  btnText: {color: 'white', fontWeight: 'bold', fontSize: 16},
});

export default App;
