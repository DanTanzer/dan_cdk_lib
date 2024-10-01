import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as path from 'path';

import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

import { SmokeTesterProps } from '../utils/types';
import { LAMBDA_FUNCTION_ARN } from '../../shared/constants';

export class SmokeTester extends Construct {
  response: string;

  constructor(scope: Construct, id: string, props: SmokeTesterProps) {
    super(scope, id);

    // get uniqueId from props or set it to empty string
    const uniqueId = props?.uniqueId || '';

    // create loggroup 
    const logGroup = new LogGroup(this, `sampleLambdaLogGroup${uniqueId}`, {
      logGroupName: `/aws/lambda/smoketest-lambda${uniqueId}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      retention: RetentionDays.ONE_DAY
    });

    const smoketestLambda = new NodejsFunction(this, 'smoketestLambda', {
      entry: path.join(__dirname, '../../lambda/smoketest/invokeLambda.ts'),
      functionName: `smoketest-lambda${uniqueId}`,
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      bundling: {
        minify: false,
        sourceMap: true,
      },
      logGroup,
      environment: {
        [LAMBDA_FUNCTION_ARN]: props.lambdaFunctionArn
      }
    });

    // Grant the Lambda function permission to invoke another Lambda function
    smoketestLambda.addToRolePolicy(new PolicyStatement({
      actions: ['lambda:InvokeFunction'],
      resources: [props.lambdaFunctionArn],
    }));

    // destory logGroup when the lamdba is deleted
    logGroup.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    // Define the custom resource provider
    const provider = new cr.Provider(this, `SmokeTestProvider${uniqueId}`, {
      onEventHandler: smoketestLambda,
    });

    // Create the custom resource
    const customResourceId = this.createCustomResourceId(`SmokeTestResource${uniqueId}`);
    const resource = new cdk.CustomResource(this, customResourceId, {
      serviceToken: provider.serviceToken,
      properties: {
        PhysicalResourceId: 'smoketest-lambda-custom-resource',
      },
    });

    // // Define any outputs you need for your construct here
    this.response = resource.getAttString('response');

  }

  // Create a custom resource id randomly, this forces the custom resource to be created
  private createCustomResourceId(id: string): string {
    return `${id}${Math.round(Math.random() * 1000000)}`;
  }
}