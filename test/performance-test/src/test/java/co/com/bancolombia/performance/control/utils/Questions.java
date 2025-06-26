package co.com.bancolombia.performance.control.utils;

import java.util.Map;

public class Questions {
    private Double DURATION_MS;
    private Double MEMORY_USED_MB;

    public String performanceValidation(String logResult, String answer, String fileName, double time, double memory) {
        String validation = "EMPTY";
        Map<String, Double> performanceValues = DataUtils.doubleValuesExtractor(logResult);
        String scenario = fileName.split("_")[0];
        switch (scenario) {
            case "baseline":
            case "load":
                System.out.println("performanceValues: "+ performanceValues);
                System.out.println("----logResult: "+ logResult);
                System.out.println("----scenario: "+ scenario);
                System.out.println("----time: "+ time);
                System.out.println("----memory: "+ memory);
                validation = isValidPerformance(performanceValues, answer, scenario, time, memory);
                break;
            case "fail":
                System.out.println("fail: ");
                System.out.println("performanceValues: "+ performanceValues);
                System.out.println("----logResult: "+ logResult);
                System.out.println("----scenario: "+ scenario);
                System.out.println("----time: "+ time);
                System.out.println("----memory: "+ memory);
                validation = isFail(performanceValues, logResult, scenario, time, memory);
                break;
            default:
                validation = "ERROR: Unrecognized scenario [" + scenario + "]";
                System.out.println(validation);
                break;
        }
        return validation;
    }

    private String isValidPerformance(Map<String, Double> response, String answer, String scenario, Double time, Double memory) {

        String flag;
        System.out.println(response);
        if (!answer.equals("null") && (response.get("executionTime") < time)
                && (response.get("memoryUsed") < memory)) {
            flag = "[" + scenario + " scenario] Successful, the execution time was: "
                    + response.get("executionTime") + " ms"
                    + " expected less: " + time + " ms"
                    + " and the memory used was: " + response.get("memoryUsed") + " MB"
                    + " expected less than: " + memory + " MB";
        } else {
            flag = "[" + scenario + " scenario] Failed, the execution time was: "
                    + response.get("executionTime") + "ms"
                    + " expected less: " + time + " ms"
                    + " and the memory used was: " + response.get("memoryUsed") + " MB"
                    + " expected less than: " + memory + " MB   aqui queda";
        }
        return flag;
    }

    private String isFail(Map<String, Double> response, String responseLog, String scenario, Double time, Double memory) {
        String flag;
        System.out.println(response);
        if (responseLog.contains("Validation Exception") && (response.get("executionTime") <= time)
                && (response.get("memoryUsed") <= memory)) {
            flag = "Successful, the execution time was: "
                    + response.get("executionTime") + "ms"
                    + " expected: " + time + "ms"
                    + " and the memory used was: " + response.get("memoryUsed") + "MB"
                    + " expected: " + memory + "MB";
        } else {
            flag = "Failed, the error is not what is expected: " + responseLog + " or the execution time was: "
                    + response.get("executionTime") + "ms"
                    + " expected: " + time + "ms"
                    + " and the memory used was: " + response.get("memoryUsed") + "MB"
                    + " expected: " + memory + "MB\n    aqui queda el fail";
        }
        System.out.println(flag);
        return flag;
    }
}
