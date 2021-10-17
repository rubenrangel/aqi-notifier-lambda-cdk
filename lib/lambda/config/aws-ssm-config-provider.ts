import { ConfigProvider } from './config-provider';
import { Parameter, SSM } from '@aws-sdk/client-ssm';

export class AwsSsmConfigProvider implements ConfigProvider {
  paramsCache: Parameter[];

  /**
   * Instantiates the provider and loads secrets from SSM parameter store into an in-memory cache.
   * @param toPhoneNumberParamKey
   * @param twilioAccountSidParamKey
   * @param twilioFromPhoneNumberParamKey
   * @param zipCodeParamKey
   * @param client
   */
  constructor(
    private readonly toPhoneNumberParamKey: string,
    private readonly twilioAccountSidParamKey: string,
    private readonly twilioFromPhoneNumberParamKey: string,
    private readonly zipCodeParamKey: string,
    readonly client: SSM = new SSM({})
  ) {
    client
      .getParameters({
        Names: [
          this.twilioAccountSidParamKey,
          this.twilioFromPhoneNumberParamKey,
          this.toPhoneNumberParamKey,
          this.zipCodeParamKey,
        ],
      })
      .then((resp) => {
        this.paramsCache = resp.Parameters as Parameter[];
      });
  }

  private getParam(paramKey: string): string {
    const find = this.paramsCache.find((param) => param.Name === paramKey);

    if (find === undefined) {
      throw new Error(`SSM parameter with name \`${paramKey}\` does not exist.`);
    }

    if (find.Value === undefined) {
      throw new Error(`SSM parameter with name \`${paramKey}\` has no value.`);
    }

    return find.Value;
  }

  getToPhoneNumber(): string {
    return this.getParam(this.toPhoneNumberParamKey);
  }

  getTwilioAccountSid(): string {
    return this.getParam(this.twilioAccountSidParamKey);
  }

  getTwilioFromPhoneNumber(): string {
    return this.getParam(this.twilioFromPhoneNumberParamKey);
  }

  getZipCode(): string {
    return this.getParam(this.zipCodeParamKey);
  }
}
