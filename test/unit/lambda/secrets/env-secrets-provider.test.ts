import { EnvSecretsProvider } from '../../../../lib/lambda/secrets/env-secrets-provider';

describe('EnvSecretsProvider', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...OLD_ENV,
      TWILIO_AUTH_TOKEN: 'some-twilio-token',
      AIR_NOW_TOKEN: 'some-air-now-token',
    }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  const provider = new EnvSecretsProvider('TWILIO_AUTH_TOKEN', 'AIR_NOW_TOKEN');

  const providerWithMissingValues = new EnvSecretsProvider('TWILIO_AUTH_TOKEN_MISSING', 'AIR_NOW_TOKEN_MISSING');

  it('should be able to access the Twilio auth token', async () => {
    await expect(provider.getTwilioAuthToken()).resolves.toBe('some-twilio-token');
    await expect(providerWithMissingValues.getTwilioAuthToken()).rejects.toEqual(
      'Environment variable `TWILIO_AUTH_TOKEN_MISSING` not found.'
    );
  });

  it('should be able to access the Air Now auth token', async () => {
    await expect(provider.getAirNowApiKey()).resolves.toBe('some-air-now-token');
    await expect(providerWithMissingValues.getAirNowApiKey()).rejects.toEqual(
      'Environment variable `AIR_NOW_TOKEN_MISSING` not found.'
    );
  });
});
