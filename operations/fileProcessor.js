const { getFileReplicationStatus, updateFileMetadata } = require("./s3Operations");

const processFile = async (bucketName, objectKey) => {
  const replicationStatus = await getFileReplicationStatus(bucketName, objectKey);
  if (replicationStatus === "REPLICA") {
    await updateFileMetadata(bucketName, objectKey);
    console.log(`Archivo procesado y metadatos actualizados: ${objectKey}`);
  }
};

module.exports = {
  processFile,
};