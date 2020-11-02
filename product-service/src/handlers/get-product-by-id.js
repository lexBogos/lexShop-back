import { productFilter } from '../utils/product-filter';
import { generateResponse } from '../adapters/generate-response';
import { mockDataProvider } from '../data-providers/mock-data-provider';

export const getProductById = async event => {
  console.log('Lambda invocation with event: ', event);
  try {
    const eventProductId = event && event.pathParameters && event.pathParameters.productId;

    const productList = await mockDataProvider();

    const resultProduct = productFilter(eventProductId, productList);
    console.log('Product search result: ', resultProduct || 'The product not found');

    const response = generateResponse(resultProduct, eventProductId);
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
