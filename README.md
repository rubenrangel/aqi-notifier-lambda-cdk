[![Build Status](https://app.travis-ci.com/rubenrangel/aqi-notifier-lambda-cdk.svg?branch=main)](https://app.travis-ci.com/rubenrangel/aqi-notifier-lambda-cdk)

# aqi-notifier-lambda-cdk

`aqi-notifier-lambda-cdk` is an L3 AWS CDK construct. It creates a Lambda function to send
an [AQI score](https://www.airnow.gov/aqi/aqi-basics/) for a specified zipcode. It leverages the [AirNow API](https://docs.airnowapi.org/webservices) and [Twilio SMS](https://www.twilio.com/docs/sms) for functionality.

## Installation

```shell
npm i aqi-notifier-lambda-cdk
```

## Usage

There are two ways to instantiate the Lambda, which provide flexibility for different situations.

### ENV var configuration

This will configure the application via environment variables. This can be handy for some proof of concept work. Of
course, you don't want to store secrets in source control. Creating the construct with empty strings for keys will still
allow you to set the values in the console, however, deploying the construct will eliminate any drift in the values.

```typescript
import * as cdk from '@aws-cdk/core';
import { EnvLambda } from "aqi-notifier-lambda-cdk/dist/lib";

export class CdkTestHarnessStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new EnvLambda(this, 'AqiNotifier', {
      openAirApiKey: '',
      toPhoneNumber: '+11234567890',
      twilioAccountSid: '1234567890abcdefghijklmn1234567890',
      twilioAuthToken: '',
      twilioFromPhoneNumber: '+11234567890',
      zipCode: '97216',
    });
  }
}
```

### AWS SSM Parameter Store and Secrets Manager

This configuration will use AWS SSM Parameter store for general configuration, and Secrets Manager for sensitive info.
The [CDK Construct cannot set the `SecretString` value](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-secretsmanager-readme.html#create-a-new-secret-in-a-stack)
, but you can set this afterwards, in a secure process. The `paramAndSecretRoot` property allows for namespacing secrets, to keep instantiations independent.

```typescript
import * as cdk from '@aws-cdk/core';
import { AwsConfigLambda } from "aqi-notifier-lambda-cdk/dist/lib";

export class CdkTestHarnessStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new AwsConfigLambda(this, 'AqiNotifier', {
      paramAndSecretRoot: "/aqi-lambda",
      openAirApiKey: "",
      toPhoneNumber: "+14322024662",
      twilioAccountSid: "ACd4a75c3e4a1fc83e68009dbb61211378",
      twilioAuthToken: "f",
      twilioFromPhoneNumber: "+12056221952",
      zipCode: "97217"
    });
  }
}
```
