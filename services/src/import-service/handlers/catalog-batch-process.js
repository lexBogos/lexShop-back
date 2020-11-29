import  AWS  from 'aws-sdk';
import { dataProviderDB } from '../../product-service/data-providers/data-provider';
import {
  lambdaLogger
} from '../../utils/lambda-logger';

const logger = lambdaLogger();

export const importProductsFile = async event => {
  logger.log('Lambda invocation with event: ', event);
  const sns = new AWS.SNS({ region: 'us-east-1' });
  const snsBucket = [];


  try {
    const dataProvider = dataProviderDB();
    const parsedEvents = event.Records.map(record => JSON.parse(record.body));
    parsedEvents.forEach(parsedEvent => {
      try{
        await dataProvider.postProduct(parsedEvent);
        logger.log('Product has been published:', product);
        snsBucket.push(sns.publish({
          Subject: "Import service result",
          Message: `Item with data ${JSON.stringify(parsedEvent)} has been published`,
          MessageAttributes: { event: 'product-published-successful' },
          TopicArn: process.env.SNS_ARN
        }).promise());
    
      }
      catch(error){
        logger.log('Product from event was not published', error);
        snsBucket.push(sns.publish({
          Subject: "Import service result",
          Message: `Item with data ${JSON.stringify(parsedEvent)} hasn't been published`,
          MessageAttributes: { event: 'product-published-failed' },
          TopicArn: process.env.SNS_ARN
        }).promise());
      }
    })

    await Promise.all(snsBucket);
    logger.log('Lambda invocation completed with success');
    return response;
  } catch (error) {
    logger.error('Error encountered', error);
    logger.error('Lambda invocation completed with error');
  }
};