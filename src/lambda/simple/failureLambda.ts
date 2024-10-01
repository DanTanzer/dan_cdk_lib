import { Handler, Context } from 'aws-lambda';

export const handler: Handler = async (event: any, context: Context) => {
    console.log('Context:', context);
    throw new Error("An error occurred");
};