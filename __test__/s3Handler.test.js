const { handleS3Event } = require("../handlers/s3Handler");
const { processFile } = require("../operations/fileProcessor");

// Constantes para valores de prueba
const TEST_BUCKET_NAME = "test-bucket";
const TEST_FILE_KEY = "folder/file1.txt";

jest.mock("../operations/fileProcessor", () => ({
  processFile: jest.fn(),
}));

describe("handleS3Event", () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it("debería procesar archivos correctamente para cada registro en el evento S3", async () => {
    const event = {
      Records: [
        {
          s3: {
            bucket: {
              name: TEST_BUCKET_NAME,
            },
            object: {
              key: TEST_FILE_KEY,
            },
          },
        },
        {
          s3: {
            bucket: {
              name: TEST_BUCKET_NAME,
            },
            object: {
              key: "folder/file2.txt",
            },
          },
        },
      ],
    };

    await handleS3Event(event);

    expect(processFile).toHaveBeenCalledTimes(2);
    expect(processFile).toHaveBeenCalledWith(TEST_BUCKET_NAME, TEST_FILE_KEY);
    expect(processFile).toHaveBeenCalledWith(TEST_BUCKET_NAME, "folder/file2.txt");
  });

  it("debería manejar correctamente eventos con un solo registro", async () => {
    const event = {
      Records: [
        {
          s3: {
            bucket: {
              name: TEST_BUCKET_NAME,
            },
            object: {
              key: TEST_FILE_KEY,
            },
          },
        },
      ],
    };

    await handleS3Event(event);

    expect(processFile).toHaveBeenCalledTimes(1);
    expect(processFile).toHaveBeenCalledWith(TEST_BUCKET_NAME, TEST_FILE_KEY);
  });

  it("debería manejar eventos sin registros", async () => {
    const event = {
      Records: [],
    };

    await handleS3Event(event);

    expect(processFile).not.toHaveBeenCalled();
  });

  it("debería manejar eventos con nombres de archivo codificados correctamente", async () => {
    const event = {
      Records: [
        {
          s3: {
            bucket: {
              name: TEST_BUCKET_NAME,
            },
            object: {
              key: "folder/file%201.txt",
            },
          },
        },
      ],
    };

    await handleS3Event(event);

    expect(processFile).toHaveBeenCalledWith(TEST_BUCKET_NAME, "folder/file 1.txt");
  });
});