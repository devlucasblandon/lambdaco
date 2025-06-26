const { listAllFiles, getFileReplicationStatus, updateFileMetadata  } = require("../operations/s3Operations");
const { s3 } = require('../config/awsConfig');
const { ListObjectsV2Command, HeadObjectCommand, CopyObjectCommand } = require('@aws-sdk/client-s3');

jest.mock('@aws-sdk/client-s3');

describe('Funciones de AWS S3', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('listAllFiles debería listar todos los archivos en el bucket', async () => {
    const mockListObjectsResponse = {
      Contents: [{ Key: 'file1.txt' }, { Key: 'file2.txt' }],
      NextContinuationToken: null,
    };
    s3.send.mockResolvedValueOnce(mockListObjectsResponse);

    const bucketName = 'my-bucket';
    const files = await listAllFiles(bucketName);

    expect(files).toEqual(mockListObjectsResponse.Contents);
    expect(s3.send).toHaveBeenCalledWith(expect.any(ListObjectsV2Command));
  });

  test('getFileReplicationStatus debería devolver el estado de replicación', async () => {
    const mockHeadObjectResponse = {
      ReplicationStatus: 'COMPLETE',
    };
    s3.send.mockResolvedValueOnce(mockHeadObjectResponse);

    const bucketName = 'my-bucket';
    const objectKey = 'file1.txt';
    const status = await getFileReplicationStatus(bucketName, objectKey);

    expect(status).toBe('COMPLETE');
    expect(s3.send).toHaveBeenCalledWith(expect.any(HeadObjectCommand));
  });

  test('updateFileMetadata debería actualizar los metadatos de un archivo', async () => {
    const mockCopyObjectResponse = {};
    s3.send.mockResolvedValueOnce(mockCopyObjectResponse);

    const bucketName = 'my-bucket';
    const objectKey = 'file1.txt';
    const metadata = { newKey: 'newValue' };
    await updateFileMetadata(bucketName, objectKey, metadata);

    expect(s3.send).toHaveBeenCalledWith(expect.any(CopyObjectCommand));
  });
});