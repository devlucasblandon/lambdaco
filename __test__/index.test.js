const { handler } = require("../index");
const { handleS3Event } = require("../handlers/s3Handler");
const { handleEventBridgeEvent } = require("../handlers/eventBridgeHandler");
const { buildResponse } = require("../utils/responseHandler");

// Constantes para códigos de estado HTTP
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

// Constantes para mensajes de respuesta
const SUCCESS_MESSAGE = "Operación completada con éxito.";
const UNKNOWN_EVENT_MESSAGE = "Evento desconocido.";
const ERROR_PROCESSING_MESSAGE = "Error al procesar el evento.";
const MOCK_ERROR_MESSAGE = "Error simulado";

jest.mock("../handlers/s3Handler", () => ({
  handleS3Event: jest.fn(),
}));

jest.mock("../handlers/eventBridgeHandler", () => ({
  handleEventBridgeEvent: jest.fn(),
}));

jest.mock("../utils/responseHandler", () => ({
  buildResponse: jest.fn((statusCode, message, error) => ({
    statusCode,
    body: JSON.stringify({ message, error }),
  })),
}));

describe("handler function", () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it("debería manejar un evento de S3", async () => {
    const mockEvent = {
      Records: [
        {
          eventSource: "aws:s3",
          eventName: "ObjectCreated:Put",
          s3: {
            bucket: { "name": "mi-bucket-localstack" },
            object: { "key": "carpeta_1/archivo1.txt" }
          }
        }
      ]
    };

    handleS3Event.mockResolvedValue(); 

    const result = await handler(mockEvent);


    expect(handleS3Event).toHaveBeenCalledTimes(1);
    expect(handleS3Event).toHaveBeenCalledWith(mockEvent);


    expect(buildResponse).toHaveBeenCalledWith(
      HTTP_STATUS_OK,
      SUCCESS_MESSAGE
    );
    expect(result).toEqual({
      statusCode: HTTP_STATUS_OK,
      body: JSON.stringify({
        message: SUCCESS_MESSAGE,
      }),
    });
  });

  it("debería manejar un evento de EventBridge", async () => {
    const mockEvent = {
      source: "aws.events"
    };

    handleEventBridgeEvent.mockResolvedValue();

    const result = await handler(mockEvent);

    expect(handleEventBridgeEvent).toHaveBeenCalledTimes(1);

    expect(buildResponse).toHaveBeenCalledWith(
      HTTP_STATUS_OK,
      SUCCESS_MESSAGE
    );
    expect(result).toEqual({
      statusCode: HTTP_STATUS_OK,
      body: JSON.stringify({
        message: SUCCESS_MESSAGE,
      }),
    });
  });

  it("debería manejar un evento desconocido", async () => {
    const mockEvent = {
      source: "evento.desconocido",
      detail: {},
    };

    const result = await handler(mockEvent);

    expect(handleS3Event).not.toHaveBeenCalled();
    expect(handleEventBridgeEvent).not.toHaveBeenCalled();

    expect(buildResponse).toHaveBeenCalledWith(
      HTTP_STATUS_BAD_REQUEST,
      UNKNOWN_EVENT_MESSAGE
    );
    expect(result).toEqual({
      statusCode: HTTP_STATUS_BAD_REQUEST,
      body: JSON.stringify({
        message: UNKNOWN_EVENT_MESSAGE,
      }),
    });
  });

  it("debería manejar errores correctamente", async () => {
    const mockEvent = {
      Records: [
        {
          eventSource: "aws:s3",
          eventName: "ObjectCreated:Put",
          s3: {
            bucket: { "name": "mi-bucket-localstack" },
            object: { "key": "carpeta_1/archivo1.txt" }
          }
        }
      ]
    };

    const mockError = new Error(MOCK_ERROR_MESSAGE);
    handleS3Event.mockRejectedValue(mockError);

    const result = await handler(mockEvent);

    expect(handleS3Event).toHaveBeenCalledTimes(1);
    expect(handleS3Event).toHaveBeenCalledWith(mockEvent);

    expect(buildResponse).toHaveBeenCalledWith(
      HTTP_STATUS_INTERNAL_SERVER_ERROR,
      ERROR_PROCESSING_MESSAGE,
      MOCK_ERROR_MESSAGE
    );
    expect(result).toEqual({
      statusCode: HTTP_STATUS_INTERNAL_SERVER_ERROR,
      body: JSON.stringify({
        message: ERROR_PROCESSING_MESSAGE,
        error: MOCK_ERROR_MESSAGE,
      }),
    });
  });
});