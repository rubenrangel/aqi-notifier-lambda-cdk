import { SecretsManager } from '@aws-sdk/client-secrets-manager';
import { SecretsProvider } from './secrets-provider';

/**
 * A class that retrieves secrets for the application via AWS Secrets Manager.
 */
export class AwsSecretsManagerProvider implements SecretsProvider {
  /**
   * @param {string} twilioAuthTokenKey - SecretsManager key for the Twilio auth token
   * @param {string} airNowApiTokenKey - SecretsManager key for the AirNow api token
   * @param {SecretsManager} client
   */
  constructor(
    private readonly twilioAuthTokenKey: string,
    private readonly airNowApiTokenKey: string,
    private readonly client: SecretsManager = new SecretsManager({})
  ) {}

  /**
   * Retrieve a secret form Secrets Manager with the given key.
   * @param {string} key
   * @throws {Error} Throws an error if a secret with the given key does not exist.
   * @private
   */
  private async getSecret(key: string) {
    const resp = await this.client.getSecretValue({
      SecretId: key,
    });

    if (resp.SecretString === undefined) {
      throw new Error(`Secret with key ${key} not found.`);
    }

    return resp.SecretString;
  }

  async getTwilioAuthToken(): Promise<string> {
    return this.getSecret(this.twilioAuthTokenKey);
  }

  async getAirNowApiKey(): Promise<string> {
    return this.getSecret(this.airNowApiTokenKey);
  }
}
