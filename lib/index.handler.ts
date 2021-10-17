import { Handler } from 'aws-lambda';
import { AqiNotifier } from './lambda/aqi-notifier';
import { EnvSecretsProvider } from './lambda/secrets/env-secrets-provider';
import { SecretsProvider } from './lambda/secrets/secrets-provider';
import { ConfigProvider } from './lambda/config/config-provider';
import { EnvConfigProvider } from './lambda/config/env-config-provider';
import { AwsSsmConfigProvider } from './lambda/config/aws-ssm-config-provider';

// Cache config between Lambda runs.
let config: ConfigProvider;

if ('TWILIO_ACCOUNT_SID' in process.env) {
  config = new EnvConfigProvider('TWILIO_ACCOUNT_SID', 'TWILIO_FROM_PHONE_NUMBER', 'TO_PHONE_NUMBER', 'ZIP_CODE');
} else {
  config = new AwsSsmConfigProvider(
    'TO_PHONE_NUMBER_PARAM_KEY',
    'TWILIO_ACCOUNT_SID_PARAM_KEY',
    'TWILIO_FROM_PHONE_NUMBER_PARAM_KEY',
    'ZIP_CODE_PARAM_KEY'
  );
}

export const handler: Handler = async () => {
  const secrets: SecretsProvider = new EnvSecretsProvider('TWILIO_AUTH_TOKEN', 'OPEN_AIR_API_KEY');
  const aqiNotifier = new AqiNotifier(config, secrets);
  await aqiNotifier.notifyAqi();
};
