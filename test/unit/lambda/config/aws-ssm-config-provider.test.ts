import { AwsSsmConfigProvider } from '../../../../lib/lambda/config/aws-ssm-config-provider';

describe('AwsSsmConfigProvider', () => {
  const getParamsFunction = jest.fn().mockReturnValue(
    Promise.resolve({
      Parameters: [
        { Name: 'TWILIO_ACCOUNT_SID', Value: 'some-sid' },
        { Name: 'TWILIO_FROM_PHONE_NUMBER', Value: '+12345678901' },
        { Name: 'TO_PHONE_NUMBER', Value: '+10987654321' },
        { Name: 'ZIP_CODE', Value: '97035' },
        { Name: 'TWILIO_ACCOUNT_SID_EMPTY', Value: undefined },
        { Name: 'TWILIO_FROM_PHONE_NUMBER_EMPTY', Value: undefined },
        { Name: 'TO_PHONE_NUMBER_EMPTY', Value: undefined },
        { Name: 'ZIP_CODE_EMPTY', Value: undefined },
      ],
    })
  );

  const client = {
    ...jest.requireActual('@aws-sdk/client-ssm').SSM,
    getParameters: getParamsFunction,
  };

  const provider = new AwsSsmConfigProvider(
    'TO_PHONE_NUMBER',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_FROM_PHONE_NUMBER',
    'ZIP_CODE',
    client
  );

  const providerWithMissingValues = new AwsSsmConfigProvider(
    'TO_PHONE_NUMBER_MISSING',
    'TWILIO_ACCOUNT_SID_MISSING',
    'TWILIO_FROM_PHONE_NUMBER_MISSING',
    'ZIP_CODE_MISSING',
    client
  );

  const providerWithEmptyValues = new AwsSsmConfigProvider(
    'TO_PHONE_NUMBER_EMPTY',
    'TWILIO_ACCOUNT_SID_EMPTY',
    'TWILIO_FROM_PHONE_NUMBER_EMPTY',
    'ZIP_CODE_EMPTY',
    client
  );

  it('should be able to access the Twilio account SID', () => {
    expect(provider.getTwilioAccountSid()).toBe('some-sid');
    expect(() => {
      providerWithMissingValues.getTwilioAccountSid();
    }).toThrowError();
    expect(() => {
      providerWithEmptyValues.getTwilioAccountSid();
    }).toThrowError();
  });

  it('should be able to access the Twilio from phone number', () => {
    expect(provider.getTwilioFromPhoneNumber()).toBe('+12345678901');
    expect(() => {
      providerWithMissingValues.getTwilioFromPhoneNumber();
    }).toThrowError();
    expect(() => {
      providerWithEmptyValues.getTwilioFromPhoneNumber();
    }).toThrowError();
  });

  it('should be able to access the to phone number', () => {
    expect(provider.getToPhoneNumber()).toBe('+10987654321');
    expect(() => {
      providerWithMissingValues.getToPhoneNumber();
    }).toThrowError();
    expect(() => {
      providerWithEmptyValues.getToPhoneNumber();
    }).toThrowError();
  });

  it('should be able to access the zip code', () => {
    expect(provider.getZipCode()).toBe('97035');
    expect(() => {
      providerWithMissingValues.getZipCode();
    }).toThrowError();
    expect(() => {
      providerWithEmptyValues.getZipCode();
    }).toThrowError();
  });
});
