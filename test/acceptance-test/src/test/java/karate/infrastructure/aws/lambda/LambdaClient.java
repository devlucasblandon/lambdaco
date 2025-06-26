package karate.infrastructure.aws.lambda;


import karate.infrastructure.aws.AwsProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.auth.credentials.AwsSessionCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.lambda.LambdaClientBuilder;
import software.amazon.awssdk.services.lambda.model.ServiceException;

import java.net.URI;


public class LambdaClient {

    private static final Logger log = LoggerFactory.getLogger(LambdaClient.class);

    public static software.amazon.awssdk.services.lambda.LambdaClient getLambdaClient(final AwsProperties awsProperties) {
        try {
            LambdaClientBuilder lambdaClientBuilder = software.amazon.awssdk.services.lambda.LambdaClient.builder()
                    .credentialsProvider(StaticCredentialsProvider.create(getSessionCredentials()))
                    .region(Region.US_EAST_1);

            if (awsProperties.hasEndpoint()) {
                lambdaClientBuilder = lambdaClientBuilder.endpointOverride(URI.create(awsProperties.getEndpoint()));
            }

            return lambdaClientBuilder.build();
        } catch (ServiceException e) {
            log.error("Error creating lambda client", e);
        }
        return null;
    }

    private static AwsCredentials getSessionCredentials() {
        return AwsSessionCredentials.create(

                System.getProperty("accessKeyIdLambda"),
                System.getProperty("secretKeyLambda"),
                System.getProperty("sessionTokenLambda")
        );
    }


}