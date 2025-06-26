package karate.infrastructure.aws.lambda;

import karate.infrastructure.aws.AwsProperties;
import karate.infrastructure.aws.LambdaProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.lambda.model.InvokeRequest;
import software.amazon.awssdk.services.lambda.model.InvokeResponse;
import software.amazon.awssdk.services.lambda.model.LambdaException;

public class LambdaExecutor {
    private static final Logger log = LoggerFactory.getLogger(LambdaExecutor.class);
    private final AwsProperties awsProperties;


    public LambdaExecutor(final AwsProperties awsProperties) {
        this.awsProperties = awsProperties;
    }

    public Integer invokeLambda() {

        final LambdaProperties lambdaProperties = this.awsProperties.getLambda();
        final software.amazon.awssdk.services.lambda.LambdaClient awsLambdaClient = LambdaClient.getLambdaClient(this.awsProperties);
        InvokeResponse res = null;
        try {
            InvokeRequest request = InvokeRequest.builder()
                    .functionName(lambdaProperties.getFunctionName())
                    .invocationType(lambdaProperties.getInvocationType())
                    .logType(lambdaProperties.getLogType())
                    .payload(SdkBytes.fromUtf8String(lambdaProperties.getEvent()))
                    .build();

            res = awsLambdaClient.invoke(request);
            return res.statusCode();

        } catch (LambdaException e) {
            log.error("Error invoking lambda function", e);
            return 400;
        }
    }
}
