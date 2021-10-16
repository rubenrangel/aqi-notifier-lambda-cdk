import {IConfig} from "./config";
import {ISecretsRepo} from "./secrets";
import {AirNow} from "./airnow";
import {Twilio} from "twilio";

export class AqiNotifier {
    private readonly config: IConfig;
    private readonly secrets: ISecretsRepo;

    constructor(config: IConfig, secrets: ISecretsRepo) {
        this.config = config;
        this.secrets = secrets;
    }

    async notifyAqi() {
        const airNow = new AirNow(await this.secrets.getAirNowApiKey() as string);
        const aqi = await airNow.getAqiForZipcode(this.config.getZipCode());

        const client = new Twilio(
            this.config.getTwilioAccountSid(),
            await this.secrets.getTwilioAuthToken() as string
        );

        return client.messages
            .create({
                body: `Latest AQI: ${aqi}`,
                from: this.config.getTwilioFromPhoneNumber(),
                to: this.config.getToPhoneNumber(),
            });
    }
}