import { SecretsProvider } from './secrets-provider';

/**
 * A class that retrieves secrets for the application via environment variables.
 */
export class EnvSecretsProvider implements SecretsProvider {
  constructor(private readonly twilioAuthTokenEnvName: string, private readonly airNowApiTokenEnvName: string) {}

  /**
   * Retrieve an environment variable by name.
   * @param {string} name
   * @throws {Error} Throws an error if an environment variable with the given name does not exist.
   * @private
   */
  private static getEnvVar(name: string) {
    const val = process.env[name];

    if (val === undefined) {
      throw new Error(`Environment variable \`${name}\` not found.`);
    }

    return Promise.resolve(val);
  }

  getAirNowApiKey(): Promise<string | undefined> {
    return EnvSecretsProvider.getEnvVar(this.airNowApiTokenEnvName);
  }

  getTwilioAuthToken(): Promise<string | undefined> {
    return EnvSecretsProvider.getEnvVar(this.twilioAuthTokenEnvName);
  }
}
