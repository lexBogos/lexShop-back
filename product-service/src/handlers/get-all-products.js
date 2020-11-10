import { generateResponse } from '../adapters/generate-response';
import { dataProviderDB } from '../data-providers/data-provider';

export const getAllProducts = async event => {
  console.log('Lambda invocation with event: ', event);
  try {

    const dataProvider = dataProviderDB();
    const productList = await dataProvider.getProducts();
    console.log('Products:', productList);

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
