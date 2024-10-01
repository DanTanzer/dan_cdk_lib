import * as cdk from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

import { RemovalPolicy } from 'aws-cdk-lib';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import { SmokeTester } from '../constructs/SmokeTester';
import { CommonProps } from '../utils/types';

export class LambdaSampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: CommonProps) {
    super(scope, id, props);
    
    // get uniqueId from props or set it to empty string
    const uniqueId = props?.uniqueId || '';
    
    // example resource
    const queue = new sqs.Queue(this, `simpleLambdaQueue${uniqueId}`, {
      visibilityTimeout: cdk.Duration.seconds(400)
    });
    queue.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    // create lambda loggroup 
    const logGroup = new LogGroup(this, `simpleLambdaLogGroup${uniqueId}`, {
      logGroupName: `/aws/lambda/simple-lambda${uniqueId}`,
      removalPolicy: RemovalPolicy.DESTROY,
      retention: RetentionDays.ONE_DAY
    });

    const simpleLambda = new NodejsFunction(this, `simpleLambda${uniqueId}`, {
      entry: path.join(__dirname, '../../lambda/simple/index.ts'),
      handler: 'handler',
      functionName: `simple-lambda${uniqueId}`,
      runtime: lambda.Runtime.NODEJS_LATEST,
      bundling: {
        minify: false,
        sourceMap: true,
      },
      logGroup
    });
    // destory loggroup when the lamdba is deleted
    simpleLambda.logGroup.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    
    // set lambda as target for queue
    queue.grantSendMessages(simpleLambda);

    // add smoketester construct to run smoke test
    const smoketester = new SmokeTester(this, `SmokeTester${uniqueId}`, {
      uniqueId,
      lambdaFunctionArn: simpleLambda.functionArn
    });
    
    // publish the response from the smoketester
    new cdk.CfnOutput(this, `SmokeTesterResponse${uniqueId}`, {
      value: smoketester.response,
      description: 'SmokeTester response'
    });
  }
}
