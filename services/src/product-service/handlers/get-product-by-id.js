import { generateResponse } from '../adapters/generate-response';
import { dataProviderDB } from '../data-providers/data-provider';

export const getProductById = async event => {
  console.log('Lambda invocation with event: ', event);
  try {
    const eventProductId = event && event.pathParameters && event.pathParameters.productId;

    const dataProvider = dataProviderDB();
    const product = await dataProvider.getProduct(eventProductId);
    console.log('Product:', product);

    console.log('Product search result: ', product || 'The product not found');

    const response = generateResponse(product, eventProductId);
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
