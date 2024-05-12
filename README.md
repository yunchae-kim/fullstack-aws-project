# Fullstack Web Application with AWS Infrastructure

This project is a very simple fullstack web application that allows users to upload files, save input data, and process files using AWS services. The application is built using React for the frontend, and the backend infrastructure is provisioned and managed using the AWS Cloud Development Kit (CDK) with TypeScript.

When a user interacts with the frontend by uploading a file and submitting the form, the following sequence of events occurs:

1. The user selects a file and enters input text in the React form (`UploadForm.js`).

2. Upon form submission, the `handleSubmit` function is triggered, which performs the following actions:

   - It sends a PUT request to the API Gateway endpoint (`/file`) using Axios, passing the file name and file content in the request body.
   - The API Gateway route is configured to trigger the `uploadFileToS3Lambda` function.

3. The `uploadFileToS3Lambda` function is invoked, which performs the following tasks:

   - It receives the file name and file content from the API Gateway request.
   - It uploads the file to the designated S3 bucket using the AWS SDK.
   - Upon successful upload, it returns the S3 file URL as a response.

4. The frontend receives the S3 file URL from the `uploadFileToS3Lambda` function response.

5. The frontend then sends a POST request to the API Gateway endpoint (`/file`) using Axios, passing the input text and the S3 file URL in the request body.

   - The API Gateway route is configured to trigger the `saveToDynamoDBLambda` function.

6. The `saveToDynamoDBLambda` function is invoked, which performs the following tasks:

   - It receives the input text and S3 file URL from the API Gateway request.
   - It saves the input text and S3 file URL as a new item in the DynamoDB table using the AWS SDK.
   - Upon successful save, it returns a response indicating the success status.

7. The DynamoDB table is configured with a DynamoDB Stream, which captures any new item insertions.

8. The `handleDynamoDBEventLambda` function is triggered whenever a new item is inserted into the DynamoDB table. It performs the following tasks:

   - It receives the DynamoDB Stream event containing the new item's details.
   - It extracts the input data (input text and S3 file URL) from the event.
   - It sends a command to start the EC2 instance using the AWS SDK.

9. The EC2 instance starts up and executes the `process_file.sh` script, which performs the following tasks:

   - It retrieves the input data (input text and S3 file URL) from the DynamoDB table.
   - It downloads the input file from the S3 bucket using the AWS CLI.
   - It appends the input text to the downloaded file and saves it as the output file.
   - It uploads the output file back to the S3 bucket.
   - It updates the corresponding item in the DynamoDB table with the output file path.

10. The processed file is now available in the S3 bucket, and the DynamoDB table is updated with the output file path.

This entire process, from the frontend file upload and form submission to the backend processing and storage, is handled by the integrated AWS services. The API Gateway acts as the entry point for the frontend requests, triggering the appropriate Lambda functions. The Lambda functions interact with S3 for file storage, DynamoDB for data persistence, and EC2 for file processing. The DynamoDB Stream enables real-time triggering of the `handleDynamoDBEventLambda` function whenever new data is inserted.

This project isn't meant for any practical use and is more of a personal project in practicing different techniques. Nonetheless, it tries to imitate the practice of utilizing AWS services and the AWS CDK for infrastructure provisioning, with the goal of providing a scalable and efficient solution for file uploads, data storage, and file processing.

## Technology Stack

- Frontend:
  - React
  - Axios
  - Tailwind CSS
- Backend:
  - AWS CDK: Infrastructure as Code (IaC) framework for defining and provisioning AWS resources
  - AWS Lambda: Serverless compute service for running code without managing servers
  - Amazon S3: Object storage service for storing files
  - Amazon DynamoDB: NoSQL database service for storing application data
  - Amazon EC2: Virtual server instances for running scripts and processing files
  - Amazon API Gateway: Fully managed service for creating, publishing, and securing APIs

## Project Structure

- `fullstack-project/`: Contains the frontend React application code

  - `src/components/UploadForm.js`: React component for the file upload form
  - `package.json`: Frontend dependencies and scripts

- `infrastructure/`: Contains the AWS CDK infrastructure code
  - `bin/app.ts`: Entry point of the CDK application
  - `lib/`: Contains the stack definitions for the infrastructure
    - `api-gateway-stack.ts`: Defines the API Gateway stack
    - `dynamodb-stack.ts`: Defines the DynamoDB table stack
    - `ec2-stack.ts`: Defines the EC2 instance stack
    - `lambda-stack.ts`: Defines the Lambda function stack
    - `s3-stack.ts`: Defines the S3 bucket stack
  - `scripts/process_file.sh`: Shell script for processing files on the EC2 instance
  - `package.json`: Backend dependencies and scripts

## Prerequisites

- AWS account with appropriate permissions
- AWS CLI installed and configured with your AWS credentials
- Node.js and npm installed
- AWS CDK Toolkit installed globally (`npm install -g aws-cdk`)

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/yunchae-kim/React-DynamoDB-Project.git
   ```

2. Navigate to the frontend directory:

   ```
   cd fullstack-project
   ```

3. Install frontend dependencies:

   ```
   npm install
   ```

4. Navigate to the infrastructure directory:

   ```
   cd ../infrastructure
   ```

5. Install backend dependencies:

   ```
   npm install
   ```

6. Bootstrap the AWS environment (if not already done):

   ```
   cdk bootstrap
   ```

7. Deploy the infrastructure:

   ```
   cdk deploy --all
   ```

8. Once the deployment is complete, you will see the output values, including the API Gateway endpoint URL.

9. Update the `baseURL` in `fullstack-project/src/components/UploadForm.js` with the API Gateway endpoint URL.

10. Start the frontend development server:

    ```
    cd ../fullstack-project
    npm start
    ```

11. Open your browser and navigate to `http://localhost:3000` to access the application.

## Testing the Application

To test the end-to-end flow of the application, follow these steps:

1. Fill out the form in the web application with the desired input text and select a file to upload.

2. Submit the form.

3. Check the AWS Management Console:

   - Navigate to the DynamoDB table and verify that a new item has been created with the input data.
   - Navigate to the S3 bucket and verify that the input file has been uploaded.

4. Wait for a few moments to allow the EC2 instance to process the file.

5. Check the AWS Management Console again:

   - Navigate to the DynamoDB table and verify that the item has been updated with the output file path.
   - Navigate to the S3 bucket and verify that the output file has been uploaded.

6. Optionally, you can SSH into the EC2 instance to check the logs and verify the script execution.

## Cleanup

To delete the deployed infrastructure and avoid incurring costs, run:

```
cd infrastructure
cdk destroy --all
```

Please note that this command will permanently delete all the resources created by this stack.

For more information about the AWS CDK, refer to the [official documentation](https://docs.aws.amazon.com/cdk/latest/guide/home.html).
