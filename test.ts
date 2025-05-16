import { TestUtils } from './src/utils/testUtils';

async function runTests() {
  try {
    const testUtils = TestUtils.getInstance();
    await testUtils.runTests();
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

runTests(); 