const aws = require("aws-sdk");

const params = {
  region: process.env.AWS_REGION,
  signatureVersion: "v4"
};
const S3_BUCKET = 'nullcast-assets'
const s3 = new aws.S3(params);

/**
 * Get the presigned url from S3 bucket
 * 
 * @param {String} path 
 * @param {String} ContentType
 * @returns 
 */
exports.getPresignedUrl = async function(path, ContentType) {
  return await s3.getSignedUrl('putObject', {
      Bucket: S3_BUCKET,
      Key: path,
      Expires: 10000,
      ContentType
  });
}
