package co.com.bancolombia.performance.control.utils;

import co.com.bancolombia.performance.control.models.ExecutionJson;
import com.amazonaws.services.lambda.model.InvokeResult;


import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class DataUtils {

    public static String createLambdaEvent(String bucket, String fileName) {
        JsonUtils.convertJsonToString(bucket, fileName);
        return ExecutionJson.getBody();
    }

    public static String payloadExtractor(InvokeResult lambdaResult) {
        return new String(lambdaResult.getPayload().array(), StandardCharsets.UTF_8);
    }

    public static String multiplyEventString(String event, String times_received){
        Integer times = Integer.parseInt(times_received);
        if (times == 1){
            return event;
        }
        StringBuilder repeatedString = new StringBuilder();
        for (int i = 0; i < times; i++) {
            repeatedString.append(event);
            if (i < times - 1) {
                repeatedString.append(", ");
            }
        }
        return repeatedString.toString();
    }

    public static String convertBase64ToString(String chain){
        return new String(Base64.getDecoder().decode(chain));
    }
    public static Map<String, Double> doubleValuesExtractor(String chain){
        Map<String, Double> values = new HashMap<>();
        double duration = Double.parseDouble(cleanValues(chain, "Duration"));
        double memoryUsed = Double.parseDouble(cleanValues(chain, "Memory Used"));
        if(chain.contains("Init Duration")){
            memoryUsed = Double.parseDouble(CleanInitDuration(chain));
            duration  += Double.parseDouble(cleanValues(chain, "Init Duration"));
        }
        values.put("executionTime", duration);
        values.put("memoryUsed", memoryUsed);
        return values;
    }

    private static String cleanValues(String chain, String token){
        return chain.split(token)[1].replaceAll("[a-zA-Z:\\s]","");
    }

    private static String CleanInitDuration(String chain) {
        return chain.split("Memory Used")[1].substring(1, 20).replaceAll("[a-zA-Z:\\s]","");
    }

}