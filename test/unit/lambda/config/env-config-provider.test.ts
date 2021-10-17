import { EnvConfigProvider } from '../../../../lib/lambda/config/env-config-provider';

describe('EnvConfigProvider', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...OLD_ENV,
      TWILIO_ACCOUNT_SID: 'some-sid',
      TWILIO_FROM_PHONE_NUMBER: '+12345678901',
      TO_PHONE_NUMBER: '+10987654321',
      ZIP_CODE: '97035',
    }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  const provider = new EnvConfigProvider(
    'TWILIO_ACCOUNT_SID',
    'TWILIO_FROM_PHONE_NUMBER',
    'TO_PHONE_NUMBER',
    'ZIP_CODE'
  );

  const providerWithMissingValues = new EnvConfigProvider(
    'TWILIO_ACCOUNT_SID_MISSING',
    'TWILIO_FROM_PHONE_NUMBER_MISSING',
    'TO_PHONE_NUMBER_MISSING',
    'ZIP_CODE_MISSING'
  );

  it('should be able to access the Twilio account SID', () => {
    expect(provider.getTwilioAccountSid()).toBe('some-sid');
    expect(() => {
      providerWithMissingValues.getTwilioAccountSid();
    }).toThrowError();
  });

  it('should be able to access the Twilio from phone number', () => {
    expect(provider.getTwilioFromPhoneNumber()).toBe('+12345678901');
    expect(() => {
      providerWithMissingValues.getTwilioFromPhoneNumber();
    }).toThrowError();
  });

  it('should be able to access the to phone number', () => {
    expect(provider.getToPhoneNumber()).toBe('+10987654321');
    expect(() => {
      providerWithMissingValues.getToPhoneNumber();
    }).toThrowError();
  });

  it('should be able to access the zip code', () => {
    expect(provider.getZipCode()).toBe('97035');
    expect(() => {
      providerWithMissingValues.getZipCode();
    }).toThrowError();
  });
});
