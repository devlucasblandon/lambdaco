package karate.infrastructure.aws;

import karate.infrastructure.aws.lambda.LambdaExecutor;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ResourcesTest {

    private final LambdaExecutor lambdaExecutor;

    public ResourcesTest() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("region", "us-east-1");
        properties.put("endpoint", "http://localhost:4566");
        properties.put("lambda", Stream.of(new String[][]{
                {"functionName", "nu0217001-simetrik-function-transportfile"},
                {"invocationType", "RequestResponse"},
                {"logType", "Tail"},
                {"event"}, {"{\\\"version\\\": \\\"0\\\", \\\"id\\\": \\\"cd5f9f7b-3b4f-4d58-9fbb-051ea010a649\\\"," +
                " \\\"source\\\": \\\"aws.events\\\", \\\"detail-type\\\": \\\"Scheduled Event\\\", \\\"account\\\": " +
                "\\\"123456789012\\\", \\\"time\\\": \\\"2025-01-10T00:00:00Z\\\", \\\"region\\\": \\\"us-east-1\\\", " +
                "\\\"resources\\\": [], \\\"detail\\\": {}}"}
        }).collect(Collectors.toMap(data -> data[0], data -> data[1])));

        System.setProperty("accessKeyIdLambda", "default");
        System.setProperty("secretKeyLambda", "default");
        System.setProperty("sessionTokenLambda", "default");

        lambdaExecutor = new LambdaExecutor(AwsProperties.fromMap(properties));
    }

    public static void main(String... s) {
        new ResourcesTest().lambdaExecutor.invokeLambda();
    }
}