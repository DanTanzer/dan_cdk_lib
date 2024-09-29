import { Handler, Context } from 'aws-lambda';

export const handler: Handler = async (event: any, context: Context) => {
    console.log('Context:', context);
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Success',
        }),
    };

    return response;
};