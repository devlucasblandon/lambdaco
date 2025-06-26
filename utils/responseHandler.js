function buildResponse(statusCode, message, body = null) {
    return {
      statusCode,
      body: JSON.stringify({ message, body }),
    };
  }
  
  module.exports = { buildResponse };