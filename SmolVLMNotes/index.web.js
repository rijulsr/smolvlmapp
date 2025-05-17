import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

console.log('Initializing app with name:', appName);

// Register the app
AppRegistry.registerComponent(appName, () => App);

// Initialize the app
const rootTag = document.getElementById('root');
console.log('Root element:', rootTag);

if (!rootTag) {
  console.error('Root element not found');
} else {
  AppRegistry.runApplication(appName, {
    rootTag,
    initialProps: {}
  });
} 