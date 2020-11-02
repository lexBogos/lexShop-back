import productList from '../productList.json';

//This is just mock that emulated call to db. 
export const mockDataProvider = async () => {

  return new Promise(res => {
    setTimeout(() => {res(productList)}, 100);
  })
};
