import {
  Stack,
  StackProps,
  aws_s3 as s3,
  CfnOutput,
  RemovalPolicy,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

// Define S3 stack
export class S3Stack extends Stack {
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'MyBucket', {
      // Deletion policies for resource management
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      // Block public access as per assessment instructions
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    new CfnOutput(this, 'BucketName', {
      value: this.bucket.bucketName,
    });
  }
}
