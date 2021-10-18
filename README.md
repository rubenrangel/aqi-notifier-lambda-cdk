[![Build Status](https://app.travis-ci.com/rubenrangel/aqi-notifier-lambda-cdk.svg?branch=main)](https://app.travis-ci.com/rubenrangel/aqi-notifier-lambda-cdk)
# Welcome to your CDK TypeScript Construct Library project!

You should explore the contents of this project. It demonstrates a CDK Construct Library that includes a
construct (`AqiNotifierLambdaCdk`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The construct defines an interface (`AqiNotifierLambdaCdkProps`) to configure the visibility timeout of the queue.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests