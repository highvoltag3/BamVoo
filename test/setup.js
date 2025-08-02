// Test setup file
process.env.NODE_ENV = 'test';

// Mock environment variables for testing
process.env.OCTO_APP_TOKEN = 'test-token';
process.env.ALEXA_SKILL_ID = 'amzn1.ask.skill.test-skill-id';
process.env.ALEXA_ACCESS_TOKEN = 'test-access-token';

// Global test utilities
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: jest.fn(),
  // error: jest.fn(),
  // warn: jest.fn(),
}; 