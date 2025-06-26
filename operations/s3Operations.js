const { s3 } = require('../config/awsConfig');
const { ListObjectsV2Command, HeadObjectCommand, CopyObjectCommand } = require('@aws-sdk/client-s3');

const listAllFiles = async (bucketName) => {
  const files = [];
  let continuationToken = null;
  do {
    const command = new ListObjectsV2Command({ Bucket: bucketName, ContinuationToken: continuationToken });
    const response = await s3.send(command);
    files.push(...response.Contents);
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);
  return files;
};

const getFileReplicationStatus = async (bucketName, objectKey) => {
  const command = new HeadObjectCommand({ Bucket: bucketName, Key: objectKey });
  const response = await s3.send(command);
  return response.ReplicationStatus;
};

const updateFileMetadata = async (bucketName, objectKey) => {
  const copySource = `${bucketName}/${objectKey}`;
  const command = new CopyObjectCommand({
    Bucket: bucketName,
    CopySource: copySource,
    Key: objectKey,
    MetadataDirective: "REPLACE"
  }); 
  await s3.send(command);
};

module.exports = {
  listAllFiles,
  getFileReplicationStatus,
  updateFileMetadata,
};