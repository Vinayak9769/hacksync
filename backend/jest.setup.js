process.env.TWILIO_ACCOUNT_SID = "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
process.env.TWILIO_AUTH_TOKEN = "your_twilio_auth_token";
process.env.TWILIO_PHONE_NUMBER = "+1234567890";
process.env.NODE_ENV = "test";

// Mock uuid globally to avoid ESM import issues with uuid v13 in Jest/CommonJS
jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid-1234-5678',
}));
