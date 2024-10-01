import { Lambda } from 'aws-sdk';
import { CloudFormationCustomResourceEvent, Context } from 'aws-lambda';

import { LAMBDA_FUNCTION_ARN } from '../../shared/constants';

export const handler = async (event: CloudFormationCustomResourceEvent, context: Context) => {
  console.log('Event: ', JSON.stringify(event, null, 2));

  // Define the physical resource ID
  const physicalResourceId = 'smoketest-lambda-custom-resource';

  const payload = {};
  const lambda = new Lambda();
  const result = await lambda.invoke({
    FunctionName: process.env[LAMBDA_FUNCTION_ARN] || 'missing lambda funtion arn',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(payload),
  }).promise();

  // log the result
  console.log("Smoke Test", LAMBDA_FUNCTION_ARN, process.env[LAMBDA_FUNCTION_ARN], payload, result)
  
  let Data: { result?: Lambda.InvocationResponse; response?: string } = { result };
  if(!result.FunctionError) {
    Data = {
      ...Data,
     "response": "SUCCESS - Smoke Test Passed"
    }
  }
  // Define the response
  const response = {
    Status: 'SUCCESS',
    PhysicalResourceId: physicalResourceId,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    Data
  };

  return response;
};