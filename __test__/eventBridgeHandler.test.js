const { handleEventBridgeEvent } = require("../handlers/eventBridgeHandler");
const { listAllFiles }  = require("../operations/s3Operations");
const { processFile } = require("../operations/fileProcessor");

jest.mock("../operations/s3Operations", () => ({
    listAllFiles: jest.fn(),
  }));
  
  jest.mock("../operations/fileProcessor", () => ({
    processFile: jest.fn(),
  }));
  
  describe("handleEventBridgeEvent", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("debería lanzar un error si no se proporciona el nombre del bucket", async () => {
      await expect(handleEventBridgeEvent()).rejects.toThrow(
        "El nombre del bucket es obligatorio."
      );
    });
  
    it("debería llamar a listAllFiles y processFile para cada archivo en el bucket", async () => {
      const mockFiles = [
        { Key: "archivo1.txt" },
        { Key: "archivo2.txt" },
      ];
      listAllFiles.mockResolvedValue(mockFiles);
      const bucketName = "mi-bucket";
      await handleEventBridgeEvent(bucketName);
  
      expect(listAllFiles).toHaveBeenCalledTimes(1);
      expect(listAllFiles).toHaveBeenCalledWith(bucketName);

      expect(processFile).toHaveBeenCalledTimes(mockFiles.length);
      expect(processFile).toHaveBeenCalledWith(bucketName, "archivo1.txt");
      expect(processFile).toHaveBeenCalledWith(bucketName, "archivo2.txt");
    });
  
    it("debería manejar un bucket vacío (sin archivos) sin errores", async () => {
      // Mockear la respuesta de listAllFiles con un array vacío
      listAllFiles.mockResolvedValue([]);
  
      const bucketName = "mi-bucket";
      await handleEventBridgeEvent(bucketName);
  
    
      expect(listAllFiles).toHaveBeenCalledTimes(1);
      expect(listAllFiles).toHaveBeenCalledWith(bucketName);
      expect(processFile).not.toHaveBeenCalled();
    });
  });