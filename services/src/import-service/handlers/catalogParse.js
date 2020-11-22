import AWS from 'aws-sdk';
const BUCKET = 'task-5-lex';
import parse from 'csv-parser';

export const catalogParse = async event => {
  console.log('Lambda invocation with event: ', event);
  // const productsName = event.queryStringParameters.name;
  // const productsPath = `productsFiles/${productsName}`;

  const s3 = new AWS.S3({
    region: 'eu-west-1'
  });

  // const sqs = new AWS.SQS();

  const processFile = async (record) => {

    console.log('record', JSON.stringify(record));
    const s3Stream = s3.getObject({
      Bucket: BUCKET,
      Key: record.s3.object.key
    }).createReadStream();

    console.log('s3 stream created.');

    const parser = s3Stream.pipe(parse());
    
    const promise = new Promise((res,rej) => {

      console.log('After pipe in the promise');
      parser.on('data', (data) => {
        console.log('data', data);
        // sqs.sendMessage({
        //   QueueUrl: process.env.SQS_URL,
        //   MessageBody: JSON.stringify(data)
        // }, (error, data) => {
        //   console.log(error, data);
        // });
      }).on('end', () => {
          res();
          console.log('s3 read stream finished.');
          // s3.deleteObject({
          //   Bucket: BUCKET,
          //   Key: record.s3.object.key
          // }, () => {
          //   console.log(record.s3.object.key.split('/')[1] + ' is parsed');
          // });
      }).on('error', (error) => {
        rej();
        console.log('s3 read stream error:', error);
      });


    })

    

    await promise;
  }

  for (const record of event.Records){
    console.log('Records', JSON.stringify(event.Records))
    console.log('record', record);
    await processFile(record);
    console.log('END!');
  }
};