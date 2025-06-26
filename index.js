const { handleS3Event } = require("./handlers/s3Handler");
const { handleEventBridgeEvent } = require("./handlers/eventBridgeHandler");
const {buildResponse} = require('./utils/responseHandler')

exports.handler = async (event) => {
  console.log("Evento recibido:", JSON.stringify(event, null, 2));

  try {

    if (event.Records && event.Records[0].eventSource === "aws:s3") {
      await handleS3Event(event);
    } else if (event.source === "aws.events")  {
      const bucketName = process.env.bucketName;
      await handleEventBridgeEvent(bucketName);
    } else {
      console.log('Evento desconocido');
      return buildResponse(400, 'Evento desconocido.');
    }

    return buildResponse(200, 'Operación completada con éxito.');
  } catch (error) {
    console.error('Error procesando el evento:', error);
    return buildResponse(500, 'Error al procesar el evento.', error.message);
  }
};
