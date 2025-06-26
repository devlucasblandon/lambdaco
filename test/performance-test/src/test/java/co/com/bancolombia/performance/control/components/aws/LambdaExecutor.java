package co.com.bancolombia.performance.control.components.aws;

import co.com.bancolombia.performance.control.utils.ConfigurationUtils;
import co.com.bancolombia.performance.control.utils.ControlValidator;
import co.com.bancolombia.performance.control.utils.DataUtils;
import com.amazonaws.services.lambda.AWSLambda;
import com.amazonaws.services.lambda.model.InvokeRequest;
import com.amazonaws.services.lambda.model.InvokeResult;
import com.amazonaws.services.lambda.model.ServiceException;

import java.io.IOException;

public class LambdaExecutor {

    public String requestLambda(String fileName, double time, double memory) throws IOException {
        String objKeyName = ConfigurationUtils.getObjKeyBucket(fileName);
        String lambdaEvent = DataUtils.createLambdaEvent(ConfigurationUtils.BucketName, objKeyName);
        InvokeRequest invokeRequest = new InvokeRequest()
                .withFunctionName(ConfigurationUtils.lambdaName)
                .withPayload(lambdaEvent)
                .withLogType("Tail");
        System.out.println(fileName + time + memory);
        return invokeLambda(invokeRequest, fileName, time, memory);
    }

    public String invokeLambda(InvokeRequest invokeRequest, String fileName, Double time, Double memory) {
        AWSLambda lambda = LambdaClient.getLambdaClient();
        InvokeResult invokeResult = null;
        try {
            assert lambda != null;
            invokeResult = lambda.invoke(invokeRequest);
        } catch (ServiceException e) {
            throw new ServiceException("Service error [invokeLambda]: " + e);
        }
        return ControlValidator.processFunctionalResponse(invokeResult, fileName, time, memory);
    }
}
