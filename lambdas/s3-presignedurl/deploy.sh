# Compress the lambda
zip -r deploy.zip ./
# Set the aws profile
export AWS_PROFILE=nullcast
# Update the lamba
aws lambda update-function-code --function-name s3-presigned-url --zip-file fileb://deploy.zip