package co.com.bancolombia.performance.control.components.aws;

import co.com.bancolombia.performance.control.utils.ConfigurationUtils;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

import java.io.File;

public class S3Executor {
    static String path = ConfigurationUtils.documentsDirPath;
    static File folder = new File(path);
    static File[] files = folder.listFiles();

    public String putFileOnBucket() {

        try {
            AmazonS3 s3 = S3Client.getS3Client();
//            assert s3 != null;
            for (File file : files) {
                // Crear solicitud con metadatos
                PutObjectRequest request = new PutObjectRequest(
                        ConfigurationUtils.BucketName,
                        ConfigurationUtils.getObjKeyName(file),
                        file
                );
                s3.putObject(request);
            }
            return "insert successful";
        } catch (AmazonServiceException s3Error) {
            throw new AmazonServiceException("S3 Service error [putFileInBucket]: " + s3Error);
        }


    }
}
