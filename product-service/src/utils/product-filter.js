export const  productFilter = (eventProductId, productList) => {

  const resultProduct = productList.filter(product => {
        return product.id === eventProductId;
  })[0];
  
  return resultProduct;
};
