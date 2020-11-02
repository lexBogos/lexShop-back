import { generateResponse } from '../adapters/generate-response';
import { mockDataProvider } from '../data-providers/mock-data-provider';

export const getAllProducts = async event => {
  console.log('Lambda invocation with event: ', event);
  try {

    const productList = await mockDataProvider();

    const response = generateResponse(productList);
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
}
