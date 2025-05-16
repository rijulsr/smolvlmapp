<<<<<<< HEAD
# smolvlmapp
=======
# SmolVLM Notes

A React Native mobile application that uses the SmolVLM model to convert handwritten notes into structured text.

## Features

- Take photos of handwritten notes
- Process images using the SmolVLM model
- Display structured text output
- Support for both Android and iOS

## Prerequisites

- Node.js (v14 or later)
- React Native development environment setup
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smolvlm-notes.git
cd smolvlm-notes
```

2. Install dependencies:
```bash
npm install
```

3. Install iOS dependencies (macOS only):
```bash
cd ios
pod install
cd ..
```

## Running the App

### Android

1. Start an Android emulator or connect a physical device
2. Run the app:
```bash
npm run android
```

### iOS (macOS only)

1. Start an iOS simulator or connect a physical device
2. Run the app:
```bash
npm run ios
```

## Testing

The app includes a test suite to verify functionality. To run the tests:

```bash
npm run test
```

The test suite verifies:
1. Service initialization
2. Model download
3. Image processing
4. Cleanup

## Project Structure

```
src/
├── config/
│   └── modelConfig.ts      # Model configuration
├── screens/
│   └── ResultsScreen.tsx   # Results display screen
├── services/
│   └── SmolVLMService.ts   # Main service for model operations
└── utils/
    ├── imageProcessor.ts   # Image preprocessing
    ├── modelDownloader.ts  # Model download management
    ├── onnxUtils.ts       # ONNX model operations
    └── testUtils.ts       # Test utilities
```

## Troubleshooting

1. If you encounter issues with the camera:
   - Ensure camera permissions are granted
   - Check device compatibility
   - Verify camera hardware is working

2. If model download fails:
   - Check internet connection
   - Verify sufficient storage space
   - Check model path permissions

3. If image processing fails:
   - Ensure proper lighting
   - Check image quality
   - Verify model is properly loaded

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
>>>>>>> 93b4423 (initial commit)
