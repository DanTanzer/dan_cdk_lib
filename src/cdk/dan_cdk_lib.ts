#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LambdaSampleStack } from './stacks/LambdaSampleStack';
import { createUniqueId } from "./utils"

const app = new cdk.App();

// define the stack name and version number
// this will help with unique naming of the stack
const version = "2";
const stackName = `LambdaSampleStack${version}`;

const uniqueId = createUniqueId(stackName);

new LambdaSampleStack(app, `${stackName}${uniqueId}`, {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1' 
  },
  uniqueId
});