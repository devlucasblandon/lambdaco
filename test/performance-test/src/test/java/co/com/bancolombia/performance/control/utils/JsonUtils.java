package co.com.bancolombia.performance.control.utils;

import com.amazonaws.services.lambda.model.ServiceException;
import co.com.bancolombia.performance.control.models.ExecutionJson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonParser;
import java.io.FileReader;
public class JsonUtils {
    public static String convertJsonToString(String bucket,String fileName){
        String jsonLambda="EMPTY";
        JsonObject objectJson;
        try {
            objectJson = jsonExtractor();
            JsonParser parser = new JsonParser();
            JsonObject file = (JsonObject) parser.parse(String.valueOf(objectJson));
            prepareRequest(bucket, fileName);
            jsonLambda = file.toString();
            return jsonLambda;
        } catch (Exception e) {
            throw new ServiceException("Error on JsonUtils -> jsonExtractor" + e);
        }
    }

    public static JsonObject jsonExtractor() throws Exception {
        JsonParser jsonParser = new JsonParser();
        Object object;
        JsonObject objectJson;
        String path = ConfigurationUtils.getEventFilePath();
        try (FileReader reader = new FileReader(path)) {
            object = jsonParser.parse(reader);
            objectJson = (JsonObject) object;
        } catch (JsonParseException e) {
            throw new ServiceException("Error on JsonUtils -> jsonExtractor" + e);
        }
        return objectJson;
    }

    //    Funcion encargada de remplazar los valores dentro del json del evento
    public static void prepareRequest(String bucketName,String keyValue){
        JsonObject jsonPetition;
        try {
            jsonPetition= jsonExtractor();
        } catch (Exception e) {
            throw new ServiceException("Error on JsonUtils -> jsonExtractor" + e);
        }
        if (!bucketName.equals("NULL") && !keyValue.equals("NULL")){
            jsonPetition = putValue(jsonPetition, "<bucketName>", bucketName);
            jsonPetition = putValue(jsonPetition, "<KeyValue>" , keyValue);
        }
        ExecutionJson.setBody(jsonPetition.toString());
    }

    public static JsonObject putValue(JsonObject jsonObject, String target, String value){
        JsonParser parser = new JsonParser();
        String objJsonAux = jsonObject.toString().replace(target, value);
        System.out.println(objJsonAux);
        return (JsonObject) parser.parse(objJsonAux);
    }
}
