@ignore @report=false
Feature: reusable scenarios to manage replication s3 actions

  @PutFiles
  Scenario:
    * def putFileOnS3 =
  """
  function() {
    var S3ExecutorClass = Java.type('co.com.bancolombia.performance.control.components.aws.S3Executor');
    var S3Executor = new S3ExecutorClass();
    return S3Executor.putFileOnBucket();
  }
  """
    * def putOnS3Result = call putFileOnS3