import {ScheduledHandler} from 'aws-lambda';
import {AwsSsmConfig, EnvConfig, IConfig} from './config';
import {EnvSecretsRepo, ISecretsRepo} from "./secrets";
import {AqiNotifier} from "./aqi-notifier";

// Cache config between runs.
let config: IConfig;

if ('TWILIO_ACCOUNT_SID' in process.env) {
    config = new EnvConfig();
} else {
    config = new AwsSsmConfig();
}

export const handler: ScheduledHandler = async (_) => {
    const secrets: ISecretsRepo = new EnvSecretsRepo();
    const aqiNotifier = new AqiNotifier(config, secrets);
    await aqiNotifier.notifyAqi();
};
