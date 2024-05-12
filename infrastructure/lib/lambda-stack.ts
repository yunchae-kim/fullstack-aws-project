import { Stack, StackProps, aws_s3 as s3 } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs';

interface LambdaStackProps extends StackProps {
  bucket: s3.Bucket;
  fileTable: dynamodb.Table;
  ec2Instance: ec2.Instance;
}

export class LambdaStack extends Stack {
  public readonly saveToDynamoDBLambda: lambda.Function;
  public readonly handleDynamoDBEventLambda: lambda.Function;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const { bucket, fileTable, ec2Instance } = props;

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

    this.handleDynamoDBEventLambda = new lambdaNodeJs.NodejsFunction(
      this,
      'HandleDynamoDBEventLambda',
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        entry: path.join(__dirname, 'lambda', 'handleDynamoDBEvent.ts'),
        handler: 'handler',
        environment: {
          EC2_INSTANCE_ID: ec2Instance.instanceId,
        },
      },
    );

    fileTable.grantStreamRead(this.handleDynamoDBEventLambda);

    const instanceArn = `arn:aws:ec2:${this.region}:${this.account}:instance/${ec2Instance.instanceId}`;

    this.handleDynamoDBEventLambda.role?.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['ec2:StartInstances', 'ec2:StopInstances'],
        resources: [instanceArn],
      }),
    );
  }
}
