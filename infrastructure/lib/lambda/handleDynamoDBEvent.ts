import { DynamoDBStreamEvent } from 'aws-lambda';
import { EC2Client, StartInstancesCommand } from '@aws-sdk/client-ec2';

const ec2Client = new EC2Client({});

export const handler = async (event: DynamoDBStreamEvent) => {
  try {
    const records = event.Records;

    for (const record of records) {
      if (record.eventName === 'INSERT') {
        const ec2InstanceId = process.env.EC2_INSTANCE_ID;

        if (!ec2InstanceId) {
          throw new Error('EC2 instance ID is missing');
        }

        const command = new StartInstancesCommand({
          InstanceIds: [ec2InstanceId],
        });

        await ec2Client.send(command);

        console.log(`Started EC2 instance: ${ec2InstanceId}`);
      }
    }
  } catch (error) {
    console.error('Error handling DynamoDB event:', error);
    throw error;
  }
};
