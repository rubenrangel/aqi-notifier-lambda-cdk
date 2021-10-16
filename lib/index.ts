import * as cdk from '@aws-cdk/core';

export interface AqiNotifierLambdaCdkProps {
  // Define construct properties here
}

export class AqiNotifierLambdaCdk extends cdk.Construct {

  constructor(scope: cdk.Construct, id: string, props: AqiNotifierLambdaCdkProps = {}) {
    super(scope, id);

    // Define construct contents here
  }
}
