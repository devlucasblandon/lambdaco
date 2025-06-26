const { processFile } = require("../operations/fileProcessor");

const handleS3Event = async (event) => {
  const records = event.Records || [];
  for (const record of records) {
    const bucketName = record.s3.bucket.name;
    const objectKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
    await processFile(bucketName, objectKey);
  }
};

module.exports = {
  handleS3Event,
};