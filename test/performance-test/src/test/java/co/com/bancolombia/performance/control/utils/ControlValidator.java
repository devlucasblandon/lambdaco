package co.com.bancolombia.performance.control.utils;

import com.amazonaws.services.lambda.model.InvokeResult;

public class ControlValidator {
    public static String processFunctionalResponse(InvokeResult lambdaResult, String file, Double time, Double memory) {
        Questions question = new Questions();
        String answer = DataUtils.payloadExtractor(lambdaResult);
        String logResult = DataUtils.convertBase64ToString(lambdaResult.getLogResult());
        return question.performanceValidation(logResult, answer, file, time, memory);
    }
}
