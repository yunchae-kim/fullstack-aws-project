# AWS Infrastructure with CDK TypeScript

This project sets up the necessary AWS infrastructure for a web application using the AWS Cloud Development Kit (CDK) with TypeScript.

## Project Structure

- `bin/`: Contains the entry point of the CDK application (`app.ts`).
- `lib/`: Contains the stack definitions for the infrastructure.
  - `s3-stack.ts`: Defines the S3 bucket stack.
  - `lambda-stack.ts`: Defines the Lambda function stack.
- `cdk.json`: Tells the CDK Toolkit how to execute the app.
- `tsconfig.json`: TypeScript configuration file.

## Prerequisites

- AWS CLI installed and configured with appropriate permissions.
- Node.js and npm installed.
- AWS CDK Toolkit installed globally (`npm install -g aws-cdk`).

## Getting Started

1. Navigate to the project directory:

   ```
   cd infrastructure
   ```

2. Install the dependencies:

   ```
   npm install
   ```

3. Bootstrap the AWS environment (if not already done):

   ```
   cdk bootstrap
   ```

4. Deploy the infrastructure:

   ```
   cdk deploy --all --outputs-file outputs.json
   ```

5. Once the deployment is complete, you can find the output values in the AWS CloudFormation console or by running:
   ```
   cdk outputs
   ```

## Cleanup

To delete the deployed infrastructure and avoid incurring costs, run:

```
cdk destroy --all
```

Please note that this command will permanently delete all the resources created by this stack.

For more information about the AWS CDK, refer to the [official
documentation](https://docs.aws.amazon.com/cdk/latest/guide/home.html).
