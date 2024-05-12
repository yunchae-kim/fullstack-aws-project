import {
  Stack,
  StackProps,
  RemovalPolicy,
  aws_dynamodb as dynamodb,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class DynamoDBStack extends Stack {
  public readonly fileTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.fileTable = new dynamodb.Table(this, 'FileTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES, // Enable DynamoDB Streams
    });

    this.fileTable.addGlobalSecondaryIndex({
      indexName: 'inputFilePathIndex',
      partitionKey: {
        name: 'input_file_path',
        type: dynamodb.AttributeType.STRING,
      },
    });

    this.fileTable.addGlobalSecondaryIndex({
      indexName: 'outputFilePathIndex',
      partitionKey: {
        name: 'output_file_path',
        type: dynamodb.AttributeType.STRING,
      },
    });
  }
}
