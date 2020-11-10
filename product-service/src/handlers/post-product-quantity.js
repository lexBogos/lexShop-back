import { generateResponse } from '../adapters/generate-response';
import { dataProviderDB } from '../data-providers/data-provider';

//for now GET method use. Will be fixed

export const postProductQuantity = async event => {
  console.log('Lambda invocation with event: ', event);
  try {

    const dataProvider = dataProviderDB();
    //TODO rework event mapper 
    console.log('queryStringParameters', event.queryStringParameters);
    const result = await dataProvider.modifyProductQuantity(event.queryStringParameters);
    console.log('Product quantity has been modified:', result);

    const response = generateResponse(result);
    console.log('Lambda invocation completed with success');

    return response;
  } catch (error) {
    console.error('Error encountered', error);
    console.error('Lambda invocation completed with error');
    return {
      statusCode: 500,
      body: 'Internal server error',
    };
  }
};