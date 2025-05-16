import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import SmolVLMService from './src/services/SmolVLMService';
import ResultsScreen from './src/screens/ResultsScreen';

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

function App(): React.JSX.Element {
  const [hasPermission, setHasPermission] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const device = useCameraDevice('back');
  const camera = React.useRef<Camera>(null);
  const smolVLMService = SmolVLMService.getInstance();

  useEffect(() => {
    checkPermission();
    initializeModel();
  }, []);

  const checkPermission = async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    setHasPermission(cameraPermission === 'granted');
  };

  const initializeModel = async () => {
    try {
      await smolVLMService.initialize();
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize the model');
      console.error(error);
    }
  };

  const takePhoto = async () => {
    if (!device) return;

    try {
      setIsProcessing(true);
      const photo = await camera.current?.takePhoto({
        qualityPrioritization: 'quality',
        flash: 'off',
      });

      if (photo) {
        const imagePath = `${RNFS.CachesDirectoryPath}/temp_${Date.now()}.jpg`;
        await RNFS.copyFile(photo.path, imagePath);
        
        const processedResult = await smolVLMService.processImage(imagePath);
        setResult(processedResult);
        setShowResults(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process image');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setShowResults(false);
    setResult(null);
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>No camera device found</Text>
      </View>
    );
  }

  if (showResults && result) {
    return (
      <ResultsScreen
        text={result.text}
        confidence={result.confidence}
        structuredData={result.structuredData}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isProcessing && styles.buttonDisabled]}
          onPress={takePhoto}
          disabled={isProcessing}>
          <Text style={styles.buttonText}>
            {isProcessing ? 'Processing...' : 'Take Photo'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App; 