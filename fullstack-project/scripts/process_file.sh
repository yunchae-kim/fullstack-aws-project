#!/bin/bash

# Retrieve input data from DynamoDB
input_text=$(aws dynamodb get-item --table-name FileTable --key '{"id": {"S": "'"$1"'"}}' --query 'Item.input_text.S' --output text)
input_file_path=$(aws dynamodb get-item --table-name FileTable --key '{"id": {"S": "'"$1"'"}}' --query 'Item.input_file_path.S' --output text)

# Download input file from S3
aws s3 cp "$input_file_path" input_file.txt

# Append input text to the downloaded file
echo "$input_text" >> input_file.txt

# Upload output file to S3
output_file_path="s3://${S3_BUCKET}/output/${1}.txt"
aws s3 cp input_file.txt "$output_file_path"

# Update DynamoDB table with output file path
aws dynamodb update-item --table-name FileTable --key '{"id": {"S": "'"$1"'"}}' --update-expression 'SET output_file_path = :path' --expression-attribute-values '{":path": {"S": "'"$output_file_path"'"}}'