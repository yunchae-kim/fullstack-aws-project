# React-DynamoDB-Project

# Testing the Application

To test the end-to-end flow of the application, follow these steps:

1. Deploy the infrastructure:

   ```
   cdk deploy --all
   ```

2. Open the web application URL in your browser.

3. Fill out the form with the desired input text and select a file to upload.

4. Submit the form.

5. Check the AWS Management Console:

   - Navigate to the DynamoDB table and verify that a new item has been created with the input data.
   - Navigate to the S3 bucket and verify that the input file has been uploaded.

6. Wait for a few moments to allow the EC2 instance to process the file.

7. Check the AWS Management Console again:

   - Navigate to the DynamoDB table and verify that the item has been updated with the output file path.
   - Navigate to the S3 bucket and verify that the output file has been uploaded.

8. Optionally, you can SSH into the EC2 instance to check the logs and verify the script execution.
