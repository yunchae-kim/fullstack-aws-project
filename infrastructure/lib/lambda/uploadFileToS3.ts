import { S3 } from 'aws-sdk';

const s3 = new S3();

export const handler = async (event: any): Promise<any> => {
  try {
    const { fileName, fileContent } = JSON.parse(event.body);

    const params = {
      Bucket: process.env.BUCKET_NAME!,
      Key: fileName,
      Body: fileContent,
      ContentType: 'application/octet-stream',
    };

    await s3.putObject(params).promise();

    const fileUrl = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ fileUrl }),
    };
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
