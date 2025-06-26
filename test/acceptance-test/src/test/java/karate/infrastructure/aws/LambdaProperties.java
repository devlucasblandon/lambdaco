package karate.infrastructure.aws;

import lombok.Builder;
import lombok.Value;

import java.util.Map;


@Value
@Builder
public class LambdaProperties {

    String functionName;
    String invocationType;
    String logType;
    String event;

    public static LambdaProperties fromMap(Map<String, Object> properties) {
        return LambdaProperties.builder()
                .functionName((String) properties.get("functionName"))
                .invocationType((String) properties.get("invocationType"))
                .logType((String) properties.get("logType"))
                .event((String) properties.get("event"))
                .build();
    }
}