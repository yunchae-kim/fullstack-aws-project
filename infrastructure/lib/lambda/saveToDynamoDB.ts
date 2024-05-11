import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamoDB = new DynamoDB.DocumentClient();

interface InputData {
  input_text: string;
  input_file_path: string;
}

export const handler = async (event: any): Promise<any> => {
  try {
    const inputData: InputData = JSON.parse(event.body);
    const id = uuidv4();

    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME!,
      Item: {
        id,
        input_text: inputData.input_text,
        input_file_path: inputData.input_file_path,
      },
    };

    await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ id }),
    };
  } catch (error) {
    console.error('Error saving to DynamoDB:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
