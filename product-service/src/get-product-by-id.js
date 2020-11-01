import productList from './productList.json';

export const getProductById = async (event) => {
  console.log('Lambda invocation with event: ', event);
  try{

  const eventProductId = event && event.pathParameters && event.pathParameters.productId;

  const resultProduct = productList.filter(product => {
    return product.id === eventProductId;
  })[0];

  console.log('Product search result: ', resultProduct || 'The product not found');

  const statusCode = resultProduct ? 200 : 400;
  const resultBody = resultProduct ? JSON.stringify(resultProduct) : `The product with id:'${resultProduct.id}' not found` 

  console.log('Lambda invocation completed with success');

  return {
    statusCode,
    body: resultBody
  };
} catch (error) {
  console.error('Error encountered', error);
  console.error('Lambda invocation completed with error');
  }
};
