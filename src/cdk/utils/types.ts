import * as cdk from 'aws-cdk-lib';

export interface CommonProps extends cdk.StackProps {
  uniqueId: string;
}

export interface SmokeTesterProps extends CommonProps {
  lambdaFunctionArn: string;
}