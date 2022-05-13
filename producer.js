'use strict';

const aws = require('aws-sdk');
const sqs = new AWS.SQS();
const AWS_ACCOUNT = process.env.ACCOUNT_ID;
const QUEUE_URL = `https://sqs.us-east-1.amazonaws.com/${AWS_ACCOUNT}/SqsQueue`;

const addEntries = () => {
  let list = [];
  for (let i = 1; i <= 10; i++) {
    list.push({
      Id: Math.random() * 100000,
      MessageBody: "Message of id: " + id,
    });
  }
  return list;
};

module.exports.sendmsg = async (event) => {
  let statusCode = 200;
  let message;

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "No body was found",
      }),
    };
  }
  try {
    await sqs
      .sendMessage({
        Entries: addEntries(),
        QueueUrl: QUEUE_URL,
        MessageBody: event.body,
        MessageAttributes: {
          AttributeName: {
            StringValue: "Attribute Value",
            DataType: "String",
          },
        },
      })
      .promise();

    message = "Message accepted!";
  } catch (error) {
    console.log(error);
    message = error;
    statusCode = 500;
  }
  return {
    statusCode,
    body: JSON.stringify({
      message,
    }),
  };
};
