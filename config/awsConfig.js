const { S3Client } = require('@aws-sdk/client-s3');
const enviroment = require('../environments/.env_aws');
//const localstackEndpoint = 'http://127.0.0.1:4566';// eliminar en ambientes


const s3 = new S3Client({
  //endpoint: localstackEndpoint, // Remove in production environments
  //forcePathStyle: true, // For localstack, but not needed for AWS in production
  region: enviroment.REGION
});

module.exports = { s3 };