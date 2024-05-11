#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { S3Stack } from '../lib/s3-stack';
import { DynamoDBStack } from '../lib/dynamodb-stack';
import { LambdaStack } from '../lib/lambda-stack';
import { ApiGatewayStack } from '../lib/api-gateway-stack';

const app = new App();
const s3Stack = new S3Stack(app, 'S3Stack');
const dynamoDBStack = new DynamoDBStack(app, 'DynamoDBStack');
const lambdaStack = new LambdaStack(app, 'LambdaStack', {
  bucket: s3Stack.bucket,
  fileTable: dynamoDBStack.fileTable,
});
new ApiGatewayStack(app, 'ApiGatewayStack', {
  saveToDynamoDBLambda: lambdaStack.saveToDynamoDBLambda,
});
