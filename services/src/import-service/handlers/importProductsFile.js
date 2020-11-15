import  AWS  from 'aws-sdk';
const BUCKET = 'task-5-lex';

export const importProductsFile = async event => {
  console.log('Lambda invocation with event: ', event);
  const productsName = event.queryStringParameters.name;
  const productsPath = `productsFiles/${productsName}`;

  const s3 = new AWS.S3({region: 'eu-west-1'});
  const params = {
    Bucket: BUCKET,
    Key: productsPath,
    Expires: 60,
  }

    return new Promise((resolve, reject)=>{ 
      s3.getSignedUrl('putObject', params, (error, url)=>{
      if (error) {
        return reject(error);
      }
      console.log(url);

      resolve({
        statusCode: 200,
        headers: {"Access-Control-Allow-Origin": "*" },
        body: url
      })
    })
    console.log('Lambda invocation completed with success');
  })
};