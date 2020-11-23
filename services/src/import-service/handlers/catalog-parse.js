import AWS from 'aws-sdk';
const BUCKET = 'task-5-lex';
import csv from 'csv-parser';
import {
  lambdaLogger
} from '../../utils/lambda-logger';

const logger = lambdaLogger();

export const catalogParse = async event => {
  logger.log('Lambda invocation with event: ', event);

  const s3 = new AWS.S3({
    region: 'eu-west-1'
  });

  const sqs = new AWS.SQS();
  const messageBucket = [];

  const processFile = record => {
    const s3Stream = s3
      .getObject({
        Bucket: BUCKET,
        Key: record.s3.object.key,
      })
      .createReadStream()
      .pipe(csv());

    return new Promise((res, rej) => {
      s3Stream
        .on('data', data => {
          logger.log('data', data);
          
          messageBucket.push(
            sqs
              .sendMessage({
                QueueUrl: process.env.SQS_URL,
                MessageBody: JSON.stringify(data),
              })
              .promise(),
          );
        })
        .on('error', error => {
          logger.log('s3 read stream error:', error);
          rej();
        })
        .on('end', () => {
          logger.log('s3 read stream finished.');
          res();
        });
    });
  };

  const results = event.Records.map(record => {
    logger.log('record:', record);
    return processFile(record);
  })
  try{
    await Promise.all(results);
    await Promise.all(messageBucket);
  }
  catch(error){
    logger.log('error', error);
  }

  logger.log('Lambda execution finished.')
};