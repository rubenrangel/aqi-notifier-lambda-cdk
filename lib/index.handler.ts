import { ScheduledHandler } from 'aws-lambda';
import { AwsSsmConfig, EnvConfig, IConfig } from './config';
import { AqiNotifier } from './aqi-notifier';
import { EnvSecretsProvider } from './secrets/env-secrets-provider';
import { SecretsProvider } from './secrets/secrets-provider';

// Cache config between runs.
let config: IConfig;

if ('TWILIO_ACCOUNT_SID' in process.env) {
  config = new EnvConfig();
} else {
  config = new AwsSsmConfig();
}

export const handler: ScheduledHandler = async () => {
  const secrets: SecretsProvider = new EnvSecretsProvider('TWILIO_AUTH_TOKEN', 'OPEN_AIR_API_KEY');
  const aqiNotifier = new AqiNotifier(config, secrets);
  await aqiNotifier.notifyAqi();
};
