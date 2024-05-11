import { Stack, StackProps, aws_s3 as s3 } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

interface LambdaStackProps extends StackProps {
  bucket: s3.Bucket;
  fileTable: dynamodb.Table;
}

export class LambdaStack extends Stack {
  public readonly saveToDynamoDBLambda: lambda.Function;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const { bucket, fileTable } = props;

    const lambdaFunction = new lambda.Function(this, 'GeneratePresignedUrl', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lib/lambda'),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    lambdaFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['s3:PutObject'],
        resources: [bucket.bucketArn + '/*'],
      }),
    );

    this.saveToDynamoDBLambda = new lambda.Function(
      this,
      'SaveToDynamoDBLambda',
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: 'saveToDynamoDB.handler',
        code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
        environment: {
          DYNAMODB_TABLE_NAME: fileTable.tableName,
        },
      },
    );

    fileTable.grantWriteData(this.saveToDynamoDBLambda);
  }
}
