const { listAllFiles } = require("../operations/s3Operations");
const { processFile } = require("../operations/fileProcessor");

const handleEventBridgeEvent = async (bucketName) => {
  if (!bucketName) {
    throw new Error("El nombre del bucket es obligatorio.");
  }
  const files = await listAllFiles(bucketName);
  for (const file of files) {
    await processFile(bucketName, file.Key);
  }
};

module.exports = {
  handleEventBridgeEvent,
};