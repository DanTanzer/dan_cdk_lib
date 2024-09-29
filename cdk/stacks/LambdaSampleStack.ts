import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import path = require('path');

export class LambdaSampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    const queue = new sqs.Queue(this, 'DanCdkLibQueue', {
      visibilityTimeout: cdk.Duration.seconds(400)
    });
    const simpleLambda = new NodejsFunction(this, 'simpleLambda', {
      entry: path.join(__dirname, '../../src/lambda/simple/index.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      bundling: {
        minify: false,
        sourceMap: true,
      },
    });
    const smoketestLambda = new NodejsFunction(this, 'smoketestLambda', {
      entry: path.join(__dirname, '../../src/lambda/smoketest/index.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      bundling: {
        minify: false,
        sourceMap: true,
      },
    });
  }
}
