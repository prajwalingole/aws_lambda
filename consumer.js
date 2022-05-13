'use strict';
const AWS = require('aws-sdk');
var sqs = new AWS.SQS();
const Backoff = require('./Backoff.js');
const AWS_ACCOUNT = process.env.ACCOUNT_ID;
const QUEUE_URL = `https://sqs.us-east-1.amazonaws.com/${AWS_ACCOUNT}/SqsQueue`;

const error = () => {
  let random = Math.random();
  if(random > 0.5){
    return true;
  }
  return false;
}

module.exports.recievemsg = async (event) => {
  const { Records } = event;

    for(let i=0;i<Records.length ;i++) {
      
        let numofretries = Records[i].attributes.ApproximateReceiveCount;
        let receipt = Records[i].receiptHandle;

                if(error()){
                    if(numofretries < 3) {
                        var params = {
                            QueueUrl: QUEUE_URL, 
                            ReceiptHandle: receipt,
                            VisibilityTimeout: parseInt(Backoff(numofretries)) 
                        };
                        
                        sqs.changeMessageVisibility(params, function(err, data) {
                          if (err) console.log(err, err.stack); // an error occurred
                          else     console.log(data);           // successful response
                        });
                        console.log(JSON.stringify(params));
                    }
                    else{
                        throw new Error("Message is failed after 3 retries");
                    }
                    throw new Error(`There is an error after ${numofretries} tries`);
                }
        console.log('Successfully processed!');
    }
};
