import { Stack, StackProps, aws_s3 as s3 } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

// Define Lambda stack
export class LambdaStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    bucket: s3.Bucket,
    props?: StackProps,
  ) {
    super(scope, id, props);

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
  }
}
