const AWS = require('aws-sdk');

//initialise dynamoDB client
const dynamoDB = new AWS.DynamoDB.DocumentClient({
    region:'us-east-1',
});
const uuid = require('uuid');



module.exports.failedMsgs = async (event) => {
  try{
      //messages coming in from SQS are available on the 'Records' array property of the event object:
      const {Records} = event;

      for (let i = 0; i < event.Records.length; i++) {
      const {body} = Records[i]; // in this case, only one item is present in the Records array
      
      //logging the incoming message body (view in cloudwatch):
      console.log("Incoming message body from SQS :", body); 
      
      //configure params for writing data to dynamo DB:
      const params = {
          TableName:'DynamodbTable',
          Item:{
            id: uuid.v1(),
            Value: body
          } 
      };
      //console.log(JSON.stringify(params));
      
      //write data to dynamo DB:
      await dynamoDB.put(params).promise();
      
      //success logging to cloudwatch:
      console.log('Successfully written to DynamoDB');
    }
  }catch(error){
      //error handling
      console.error('Error in executing lambda handler for SQS',error);
      return;
  }
};