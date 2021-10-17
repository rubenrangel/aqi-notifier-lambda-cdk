import { AwsSecretsManagerProvider } from '../../../../lib/lambda/secrets/aws-secrets-manager-provider';

describe('AwsSecretsManagerProvider', () => {
  const getSecretValueFunction = jest.fn((input) => {
    switch (input.SecretId) {
      case 'TWILIO_AUTH_TOKEN':
        return Promise.resolve({ SecretString: 'some-twilio-token' });
      case 'AIR_NOW_TOKEN':
        return Promise.resolve({ SecretString: 'some-air-now-token' });
      default:
        return Promise.resolve({ SecretString: undefined });
    }
  });

  const client = {
    ...jest.requireActual('@aws-sdk/client-secrets-manager').SecretsManager,
    getSecretValue: getSecretValueFunction,
  };
  const provider = new AwsSecretsManagerProvider('TWILIO_AUTH_TOKEN', 'AIR_NOW_TOKEN', client);

  const providerWithMissingValues = new AwsSecretsManagerProvider(
    'TWILIO_AUTH_TOKEN_MISSING',
    'AIR_NOW_TOKEN_MISSING',
    client
  );

  it('should be able to access the Twilio auth token', async () => {
    await expect(provider.getTwilioAuthToken()).resolves.toBe('some-twilio-token');
    await expect(providerWithMissingValues.getTwilioAuthToken()).rejects.toEqual(
      'Secret with key `TWILIO_AUTH_TOKEN_MISSING` not found.'
    );
  });

  it('should be able to access the Air Now auth token', async () => {
    await expect(provider.getAirNowApiKey()).resolves.toBe('some-air-now-token');
    await expect(providerWithMissingValues.getAirNowApiKey()).rejects.toEqual(
      'Secret with key `AIR_NOW_TOKEN_MISSING` not found.'
    );
  });
});
