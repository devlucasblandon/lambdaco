package co.com.bancolombia.performance.control.components.aws;

import com.amazonaws.auth.SystemPropertiesCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.lambda.model.ServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

public class S3Client {
    public static AmazonS3 getS3Client() {
        try {
            return AmazonS3ClientBuilder.standard()
                    .withCredentials(new SystemPropertiesCredentialsProvider())
                    .withRegion(Regions.US_EAST_1)
                    .build();

        } catch (ServiceException e) {
            System.out.println("Raising " + e + "error");
        }
        return null;
    }
}
