import { Client } from "pg"

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const parameters = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 5000,
}



export const dataProviderDB = () => ({

  getProducts: async () => {
      const client = new Client(parameters);
      await client.connect();
      try {
        const res = await client.query('SELECT * from products INNER JOIN stocks element ON id = element.product_id');
        console.log('getAllResults:', res.rows);
        return res.rows;
      } catch (err) {
          console.error('Error during database request executing:', err);
      } finally {
          client.end();
      }
  },
  getProduct: async(id) => {
    const client = new Client(parameters);
    await client.connect();
    try {
      const res = await client.query('SELECT * from products product INNER JOIN stocks element ON id = element.product_id WHERE product.id = $1',[id]);
      console.log('getByIDResults', res.rows);
      return res.rows;
    } catch (err) {
        console.error('Error during database request executing:', err);
    } finally {
        client.end();
    }
  },
  postProduct: async (productmodel) => {
    const client = new Client(parameters);
    await client.connect();
    try {
    const queryTextProduct = `INSERT INTO products(id, title, description, price, currency) VALUES($1, $2, $3, $4, $5) RETURNING *`;
    const resProduct = await client.query(queryTextProduct, [productmodel.id, productmodel.title, productmodel.description, Number(productmodel.price), productmodel.currency]);
    console.log('resProduct', resProduct);
    const queryTextProductQuantity = `INSERT INTO stocks(product_id, count) VALUES($1, $2) RETURNING *`;
    const resProductQuantity = await client.query(queryTextProductQuantity, [productmodel.id, 0]);
    console.log('resProductQuantity', resProductQuantity);
    return resProduct;
  } catch (err) {
    console.error('Error during database request executing:', err);
  } finally {
      client.end();
  }
  },
  modifyProductQuantity: async (properties) => {
    const client = new Client(parameters);
    await client.connect();
    try{
    const queryTextProductQuantity = `UPDATE stocks SET count = $2 WHERE product_id = $1  RETURNING *`;
    const resProductQuantity = await client.query(queryTextProductQuantity, [properties.product_id, Number(properties.quantity)]);
    console.log('postProductQuantity', resProductQuantity);
    return resProductQuantity;
  } catch (err) {
    console.error('Error during database request executing:', err);
  } finally {
      client.end(); 
  }
  }
})
