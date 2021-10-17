import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import * as SSM from '@aws-cdk/aws-ssm';
import { ParameterType } from '@aws-cdk/aws-ssm';
import * as SecretsManager from '@aws-cdk/aws-secretsmanager';

export interface AqiEnvConfig {
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioFromPhoneNumber: string;
  toPhoneNumber: string;
  openAirApiKey: string;
  zipCode: string;
}

export interface AqiAwsConfig extends AqiEnvConfig {
  paramAndSecretRoot: string;
}

function getLambda(scope: cdk.Construct, environment: { [key: string]: string }) {
  return new lambda.NodejsFunction(scope, 'handler', {
    environment: environment,
  });
}

export class EnvLambda extends cdk.Construct {
  public readonly lambda: lambda.NodejsFunction;

  constructor(scope: cdk.Construct, id: string, config: AqiEnvConfig) {
    super(scope, id);

    this.lambda = getLambda(this, {
      TWILIO_ACCOUNT_SID: config.twilioAccountSid,
      TWILIO_AUTH_TOKEN: config.twilioAuthToken,
      TWILIO_FROM_PHONE_NUMBER: config.twilioFromPhoneNumber,
      TO_PHONE_NUMBER: config.toPhoneNumber,
      OPEN_AIR_API_KEY: config.openAirApiKey,
      ZIP_CODE: config.zipCode,
    });
  }
}

export class AwsConfigLambda extends cdk.Construct {
  public readonly lambda: lambda.NodejsFunction;

  constructor(scope: cdk.Construct, id: string, config: AqiAwsConfig) {
    super(scope, id);

    const twilioAccountSid = new SSM.StringParameter(this, 'TwilioAccountSid', {
      stringValue: config.twilioAccountSid,
      type: ParameterType.STRING,
      description: 'The SID of the Twilio account to use.',
      parameterName: `${config.paramAndSecretRoot}/twilio-account-sid`,
    });

    const twilioAccountAuthToken = new SecretsManager.Secret(this, 'TwilioAuthToken', {
      description: 'The auth token for Twilio',
      secretName: `${config.paramAndSecretRoot}/twilio-auth-token`,
    });

    const twilioFromPhoneNumber = new SSM.StringParameter(this, 'TwilioFromPhoneNumber', {
      stringValue: config.twilioFromPhoneNumber,
      type: ParameterType.STRING,
      description: 'The Twilio phone number to use for SMS.',
      parameterName: `${config.paramAndSecretRoot}/twilio-from-phone-number`,
    });

    const toPhoneNumber = new SSM.StringParameter(this, 'ToPhoneNumber', {
      stringValue: config.toPhoneNumber,
      type: ParameterType.STRING,
      description: 'The phone number to send AQI notifications to.',
      parameterName: `${config.paramAndSecretRoot}/to-phone-number`,
    });

    const openAqiApiKey = new SecretsManager.Secret(this, 'OpenAqiApiKey', {
      description: 'The auth token for Open AQI',
      secretName: `${config.paramAndSecretRoot}/open-aqi-api-key`,
    });

    const zipCode = new SSM.StringParameter(this, 'ZipCode', {
      stringValue: config.zipCode,
      type: ParameterType.STRING,
      description: 'The zip code to retrieve AQI for.',
      parameterName: `${config.paramAndSecretRoot}/zip-code`,
    });

    this.lambda = getLambda(this, {
      TWILIO_ACCOUNT_SID_PARAM_KEY: twilioAccountSid.parameterName,
      TWILIO_ACCOUNT_AUTH_TOKEN_PARAM_KEY: twilioAccountAuthToken.secretName,
      TWILIO_FROM_PHONE_NUMBER_PARAM_KEY: twilioFromPhoneNumber.parameterName,
      TO_PHONE_NUMBER_PARAM_KEY: toPhoneNumber.parameterName,
      OPEN_AQI_API_KEY_PARAM_KEY: openAqiApiKey.secretName,
      ZIP_CODE_PARAM_KEY: zipCode.parameterName,
    });

    twilioAccountSid.grantRead(this.lambda);
    twilioAccountAuthToken.grantRead(this.lambda);
    twilioFromPhoneNumber.grantRead(this.lambda);
    toPhoneNumber.grantRead(this.lambda);
    openAqiApiKey.grantRead(this.lambda);
    zipCode.grantRead(this.lambda);
  }
}
