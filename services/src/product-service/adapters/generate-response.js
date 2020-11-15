export const generateResponse = (resultProduct, eventProductId) => {

    const result = resultProduct
    ? {
        statusCode: 200,
        body: JSON.stringify(resultProduct),
      }
    : {
        statusCode: 404,
        body: `The product with id:'${eventProductId}' not found`,
      };

  return result;
};
