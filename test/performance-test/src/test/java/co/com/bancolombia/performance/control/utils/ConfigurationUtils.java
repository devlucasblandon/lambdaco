package co.com.bancolombia.performance.control.utils;

import java.io.File;

public class ConfigurationUtils {
    // AWS Configuration, write any aws configuration here
    final public static String lambdaName = "nu0217001-simetrik-function-transportfile";
    final public static String BucketName = "nu0217001-simetrik-" + System.getProperty("environment") + "-replicationtest";
    final public static String eventFilePath = "src/test/resources/files/events";
    final public static String documentsDirPath = "src/test/resources/files/documents";
    final public static String fileObjKeyName = "Performance/";
    final public static String testName = "nu0217001";


    public static String getEventFilePath() {
        return eventFilePath + "/event.json";
    }

    public static String getFileName(String fileSample) {
        switch (fileSample) {
            case "baseline":
                return "archivo_5mb.csv";
            case "load":
                return "archivo_10mb.csv";
            default:
                return testName + "_" + fileSample + ".csv";
        }
    }

    public static String getObjKeyName(File file) {
        if (!file.equals("NULL")) {
            return fileObjKeyName + file.getName();
        } else {
            return "NULL";
        }
    }

    public static String getObjKeyBucket(String file) {
        if (!file.equals("NULL")) {
            return fileObjKeyName + getFileName(file);
        } else {
            return "NULL";
        }
    }

}