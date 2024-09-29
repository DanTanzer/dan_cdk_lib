#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LambdaSampleStack } from './stacks/LambdaSampleStack';

const app = new cdk.App();
new LambdaSampleStack(app, 'LambdaSampleStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT,
  region: 'us-east-1' },
});