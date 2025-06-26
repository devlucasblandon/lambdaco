package karate.infrastructure.aws;

import lombok.Builder;
import lombok.Value;

import java.util.Map;


@Value
@Builder
public class AwsProperties {

    String region;
    String endpoint;
    LambdaProperties lambda;

    @SuppressWarnings("unchecked")
    public static AwsProperties fromMap(Map<String, Object> properties) {
        return AwsProperties.builder()
                .region((String) properties.get("region"))
                .endpoint((String) properties.get("endpoint"))
                .lambda(LambdaProperties.fromMap((Map<String, Object>) properties.get("lambda")))
                .build();
    }

    public boolean hasEndpoint() {
        return getEndpoint() != null && !getEndpoint().isEmpty();
    }

    public boolean hasRegion() {
        return getRegion() != null && !getRegion().isEmpty();
    }
}