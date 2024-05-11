import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';

interface ApiGatewayStackProps extends StackProps {
  saveToDynamoDBLambda: lambda.Function;
}

export class ApiGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    const api = new apigateway.RestApi(this, 'FileTableApi', {
      restApiName: 'File Table API',
    });

    const saveToDynamoDBIntegration = new apigateway.LambdaIntegration(
      props.saveToDynamoDBLambda,
    );

    const fileResource = api.root.addResource('file');
    fileResource.addMethod('POST', saveToDynamoDBIntegration);
  }
}
