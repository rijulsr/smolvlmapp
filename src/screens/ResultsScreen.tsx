import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

interface Section {
  heading: string;
  content: string;
}

interface StructuredData {
  title?: string;
  sections?: Section[];
}

interface ResultsScreenProps {
  text: string;
  confidence: number;
  structuredData?: StructuredData;
  onRetry: () => void;
  isLoading?: boolean;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  text,
  confidence,
  structuredData,
  onRetry,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Processing your note...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {structuredData?.title && (
          <Text style={styles.title}>{structuredData.title}</Text>
        )}
        
        {structuredData?.sections?.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.heading}>{section.heading}</Text>
            <Text style={styles.content}>{section.content}</Text>
          </View>
        ))}

        {!structuredData && (
          <Text style={styles.plainText}>{text}</Text>
        )}

        <Text style={styles.confidence}>
          Confidence: {(confidence * 100).toFixed(1)}%
        </Text>
      </ScrollView>

      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Take Another Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  plainText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  confidence: {
    fontSize: 14,
    color: '#666',
    marginTop: 20,
    marginBottom: 40,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResultsScreen; 