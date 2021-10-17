import { AirNow } from './airnow';
import { Twilio } from 'twilio';
import { SecretsProvider } from './secrets/secrets-provider';
import { ConfigProvider } from './config/config-provider';

export class AqiNotifier {
  constructor(private readonly config: ConfigProvider, private readonly secrets: SecretsProvider) {
    this.config = config;
    this.secrets = secrets;
  }

  /**
   * Sends the latest AQI score for the configured zip code to the provided phone number.
   */
  async notifyAqi() {
    const airNow = new AirNow(await this.secrets.getAirNowApiKey());
    const zipCode = this.config.getZipCode();
    const aqi = await airNow.getAqiForZipcode(zipCode);

    const client = new Twilio(this.config.getTwilioAccountSid(), await this.secrets.getTwilioAuthToken());

    return client.messages.create({
      body: `Latest AQI for ${zipCode}: ${aqi}`,
      from: this.config.getTwilioFromPhoneNumber(),
      to: this.config.getToPhoneNumber(),
    });
  }
}
