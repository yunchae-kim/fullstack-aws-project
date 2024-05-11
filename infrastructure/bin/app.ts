#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { S3Stack } from '../lib/s3-stack';
import { LambdaStack } from '../lib/lambda-stack';
import { DynamoDBStack } from '../lib/dynamodb-stack';

const app = new App();
const s3Stack = new S3Stack(app, 'S3Stack');
const dynamoDBStack = new DynamoDBStack(app, 'DynamoDBStack');
new LambdaStack(app, 'LambdaStack', s3Stack.bucket);
