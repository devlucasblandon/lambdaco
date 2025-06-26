package co.com.bancolombia.performance.control.components.aws;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.lambda.AWSLambda;
import com.amazonaws.services.lambda.AWSLambdaClientBuilder;
import com.amazonaws.services.lambda.model.ServiceException;

public class LambdaClient {

    public static AWSLambda getLambdaClient() {
        try {
            return AWSLambdaClientBuilder.standard()
                    .withCredentials(
                            new AWSStaticCredentialsProvider(getSessionCredentials())
                    )
                    .withRegion(Regions.US_EAST_1)
                    .build();
        } catch (ServiceException e) {
            System.out.println("Raising " + e + "error");
        }
        return null;
    }

    private static AWSCredentials getSessionCredentials() {
        return new BasicSessionCredentials(
                System.getProperty("accessKeyIdLambda"),
                System.getProperty("secretKeyLambda"),
                System.getProperty("sessionTokenLambda")
        );
    }
}