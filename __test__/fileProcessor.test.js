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

  // Funciones auxiliares para verificaciones comunes
  const verifyGetFileReplicationStatusCalled = () => {
    expect(getFileReplicationStatus).toHaveBeenCalledTimes(1);
    expect(getFileReplicationStatus).toHaveBeenCalledWith(bucketName, objectKey);
  };

  const verifyUpdateFileMetadataCalled = () => {
    expect(updateFileMetadata).toHaveBeenCalledTimes(1);
    expect(updateFileMetadata).toHaveBeenCalledWith(bucketName, objectKey);
  };

  const verifyUpdateFileMetadataNotCalled = () => {
    expect(updateFileMetadata).not.toHaveBeenCalled();
  };

  describe("cuando el estado de replicación es 'REPLICA'", () => {
    it("debería actualizar los metadatos", async () => {
      getFileReplicationStatus.mockResolvedValue("REPLICA");

      await processFile(bucketName, objectKey);

      verifyGetFileReplicationStatusCalled();
      verifyUpdateFileMetadataCalled();
    });
  });

  describe("cuando el estado de replicación no es 'REPLICA'", () => {
    it("no debería actualizar los metadatos", async () => {
      getFileReplicationStatus.mockResolvedValue("PENDING");

      await processFile(bucketName, objectKey);

      verifyGetFileReplicationStatusCalled();
      verifyUpdateFileMetadataNotCalled();
    });
  });

  describe("manejo de errores", () => {
    it("debería manejar errores al obtener el estado de replicación", async () => {
      getFileReplicationStatus.mockRejectedValue(new Error("Error al obtener el estado"));

      const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

      await expect(processFile(bucketName, objectKey)).rejects.toThrow(
        "Error al obtener el estado"
      );

      verifyUpdateFileMetadataNotCalled();
      consoleSpy.mockRestore();
    });

    it("debería manejar errores al actualizar los metadatos", async () => {
      getFileReplicationStatus.mockResolvedValue("REPLICA");
      updateFileMetadata.mockRejectedValue(new Error("Error al actualizar metadatos"));

      const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

      await expect(processFile(bucketName, objectKey)).rejects.toThrow(
        "Error al actualizar metadatos"
      );

      verifyGetFileReplicationStatusCalled();
      verifyUpdateFileMetadataCalled();
      consoleSpy.mockRestore();
    });
  });
});