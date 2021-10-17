import { ConfigProvider } from './config-provider';

export class EnvConfigProvider implements ConfigProvider {
  constructor(
    private readonly twilioAccountSidEnvName: string,
    private readonly twilioFromPhoneNumberEnvName: string,
    private readonly toPhoneNumberEnvName: string,
    private readonly zipCodeEnvName: string
  ) {}

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

    return val;
  }

  getToPhoneNumber(): string {
    return EnvConfigProvider.getEnvVar(this.toPhoneNumberEnvName);
  }

  getTwilioAccountSid(): string {
    return EnvConfigProvider.getEnvVar(this.twilioAccountSidEnvName);
  }

  getTwilioFromPhoneNumber(): string {
    return EnvConfigProvider.getEnvVar(this.twilioFromPhoneNumberEnvName);
  }

  getZipCode(): string {
    return EnvConfigProvider.getEnvVar(this.zipCodeEnvName);
  }
}
