const { processFile } = require("../operations/fileProcessor");
const { getFileReplicationStatus, updateFileMetadata } = require("../operations/s3Operations");

// Mockear las dependencias
jest.mock("../operations/s3Operations", () => ({
  getFileReplicationStatus: jest.fn(),
  updateFileMetadata: jest.fn(),
}));

describe("processFile", () => {
  const bucketName = "test-bucket";
  const objectKey = "test-file.txt";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debería actualizar los metadatos si el estado de replicación es 'REPLICA'", async () => {
    getFileReplicationStatus.mockResolvedValue("REPLICA");

    await processFile(bucketName, objectKey);

    expect(getFileReplicationStatus).toHaveBeenCalledTimes(1);
    expect(getFileReplicationStatus).toHaveBeenCalledWith(bucketName, objectKey);

    expect(updateFileMetadata).toHaveBeenCalledTimes(1);
    expect(updateFileMetadata).toHaveBeenCalledWith(bucketName, objectKey);
  });

  it("no debería actualizar los metadatos si el estado de replicación no es 'REPLICA'", async () => {
    getFileReplicationStatus.mockResolvedValue("PENDING");

    await processFile(bucketName, objectKey);

    expect(getFileReplicationStatus).toHaveBeenCalledTimes(1);
    expect(getFileReplicationStatus).toHaveBeenCalledWith(bucketName, objectKey);

    expect(updateFileMetadata).not.toHaveBeenCalled();
  });

  it("debería manejar errores al obtener el estado de replicación", async () => {
    getFileReplicationStatus.mockRejectedValue(new Error("Error al obtener el estado"));

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await expect(processFile(bucketName, objectKey)).rejects.toThrow(
      "Error al obtener el estado"
    );

    expect(updateFileMetadata).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("debería manejar errores al actualizar los metadatos", async () => {
    getFileReplicationStatus.mockResolvedValue("REPLICA");

    updateFileMetadata.mockRejectedValue(new Error("Error al actualizar metadatos"));

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});


    await expect(processFile(bucketName, objectKey)).rejects.toThrow(
      "Error al actualizar metadatos"
    );

    expect(getFileReplicationStatus).toHaveBeenCalledTimes(1);
    expect(getFileReplicationStatus).toHaveBeenCalledWith(bucketName, objectKey);

    expect(updateFileMetadata).toHaveBeenCalledTimes(1);
    expect(updateFileMetadata).toHaveBeenCalledWith(bucketName, objectKey);

    consoleSpy.mockRestore();
  });
});