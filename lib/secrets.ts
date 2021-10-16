import {SecretsManager} from "@aws-sdk/client-secrets-manager";

export interface ISecretsRepo {
    getTwilioAuthToken(): Promise<string | undefined>;
    getAirNowApiKey(): Promise<string | undefined>;
}

export class AwsSecretsManagerRepo implements ISecretsRepo {
    private readonly client: SecretsManager;

    constructor() {
        this.client = new SecretsManager({});
    }

    async getSecret(key: string) {
        const resp = await this.client.getSecretValue({
            SecretId: key
        });

        return resp.SecretString;
    }

    async getTwilioAuthToken() {
        return this.getSecret(process.env.TWILIO_ACCOUNT_AUTH_TOKEN_PARAM_KEY as string);
    }

    async getAirNowApiKey() {
        return this.getSecret(process.env.OPEN_AIR_API_KEY_PARAM_KEY as string);
    }
}

export class EnvSecretsRepo implements ISecretsRepo {
    getAirNowApiKey(): Promise<string | undefined> {
        return Promise.resolve(process.env.OPEN_AIR_API_KEY);
    }

    getTwilioAuthToken(): Promise<string | undefined> {
        return Promise.resolve(process.env.TWILIO_AUTH_TOKEN);
    }
}