import { AirNow } from './airnow';
import { Twilio } from 'twilio';
import { SecretsProvider } from './secrets/secrets-provider';
import { ConfigProvider } from './config/config-provider';

export class AqiNotifier {
  private readonly config: ConfigProvider;
  private readonly secrets: SecretsProvider;

  constructor(config: ConfigProvider, secrets: SecretsProvider) {
    this.config = config;
    this.secrets = secrets;
  }

  async notifyAqi() {
    const airNow = new AirNow((await this.secrets.getAirNowApiKey()) as string);
    const aqi = await airNow.getAqiForZipcode(this.config.getZipCode());

    const client = new Twilio(this.config.getTwilioAccountSid(), (await this.secrets.getTwilioAuthToken()) as string);

    return client.messages.create({
      body: `Latest AQI: ${aqi}`,
      from: this.config.getTwilioFromPhoneNumber(),
      to: this.config.getToPhoneNumber(),
    });
  }
}
