import { ConfigProvider } from '../../../lib/lambda/config/config-provider';
import { SecretsProvider } from '../../../lib/lambda/secrets/secrets-provider';

const mockGetAqiFunction = jest.fn().mockReturnValue(19);

jest.mock(__dirname + '/../../../lib/lambda/airnow.ts', () => {
  return {
    AirNow: jest.fn().mockImplementation(() => ({
      getAqiForZipcode: mockGetAqiFunction,
    })),
  };
});

const mockSendMessageFunction = jest.fn();

jest.mock('twilio', () => {
  return {
    Twilio: jest.fn().mockImplementation(() => ({
      messages: {
        create: mockSendMessageFunction,
      },
    })),
  };
});

import { AqiNotifier } from '../../../lib/lambda/aqi-notifier';

describe('AqiNotifier', () => {
  describe('notifyAqi', () => {
    it('calls dependent services', async () => {
      const config: ConfigProvider = {
        getZipCode: () => '97212',
        getTwilioAccountSid: () => 'some-sid',
        getTwilioFromPhoneNumber: () => '+12345678901',
        getToPhoneNumber: () => '+0987654321',
      };
      const secrets: SecretsProvider = {
        getAirNowApiKey: async () => 'some-api-key',
        getTwilioAuthToken: async () => 'some-auth-token',
      };

      const notifier = new AqiNotifier(config, secrets);
      await notifier.notifyAqi();
      expect(mockGetAqiFunction).toBeCalledWith('97212');
      expect(mockSendMessageFunction).toBeCalledWith({
        from: '+12345678901',
        to: '+0987654321',
        body: 'Latest AQI for 97212: 19',
      });
    });
  });
});
