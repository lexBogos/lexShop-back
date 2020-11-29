import  AWS  from 'aws-sdk';
const BUCKET = 'task-5-lex';
import {
  lambdaLogger
} from '../../utils/lambda-logger';

const logger = lambdaLogger();

export const importProductsFile = async event => {
  logger.log('Lambda invocation with event: ', event);
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
      logger.log('url', url);

      resolve({
        statusCode: 200,
        headers: {"Access-Control-Allow-Origin": "*" },
        body: url
      })
    })
    logger.log('Lambda invocation completed with success');
  })
};