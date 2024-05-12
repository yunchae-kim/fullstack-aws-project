import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';

interface ApiGatewayStackProps extends StackProps {
  saveToDynamoDBLambda: lambda.Function;
  uploadFileToS3Lambda: lambda.Function;
}

export class ApiGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    const api = new apigateway.RestApi(this, 'MyAPIGateway', {
      restApiName: 'My Api Gateway',
    });

    const uploadFileToS3Integration = new apigateway.LambdaIntegration(
      props.uploadFileToS3Lambda,
    );
    const saveToDynamoDBIntegration = new apigateway.LambdaIntegration(
      props.saveToDynamoDBLambda,
    );

    const fileResource = api.root.addResource('file');

    const ALLOWED_HEADERS = [
      'Content-Type',
      'X-Amz-Date',
      'X-Amz-Security-Token',
      'Authorization',
      'X-Api-Key',
      'X-Requested-With',
      'Accept',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
    ];

    const standardCorsMockIntegration = new apigateway.MockIntegration({
      integrationResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': `'${ALLOWED_HEADERS.join(
              ',',
            )}'`,
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Credentials':
              "'false'",
            'method.response.header.Access-Control-Allow-Methods':
              "'OPTIONS,PUT,POST,GET,DELETE'",
          },
        },
      ],
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': '{"statusCode": 200}',
      },
    });

    const optionsMethodResponse = {
      statusCode: '200',
      responseModels: {
        'application/json': apigateway.Model.EMPTY_MODEL,
      },
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': true,
        'method.response.header.Access-Control-Allow-Methods': true,
        'method.response.header.Access-Control-Allow-Credentials': true,
        'method.response.header.Access-Control-Allow-Origin': true,
      },
    };

    fileResource.addMethod('PUT', uploadFileToS3Integration, {
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Headers': true,
          },
        },
      ],
    });

    fileResource.addMethod('POST', saveToDynamoDBIntegration, {
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Headers': true,
          },
        },
      ],
    });

    fileResource.addMethod('OPTIONS', standardCorsMockIntegration, {
      authorizationType: apigateway.AuthorizationType.NONE,
      methodResponses: [optionsMethodResponse],
    });
  }
}
