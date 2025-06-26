Feature: Test for performance validation of lambda replication

  Background:
    * configure report = { showLog: true, showAllSteps: false }
    * def invokeLambda =
  """
  function(file, times, type) {
    var LambdaExecutorClass = Java.type('co.com.bancolombia.performance.control.components.aws.LambdaExecutor');
    var replication = new LambdaExecutorClass();
    return replication.requestLambda(file, times, type);
  }
  """

#  Scenario: Put files on bucket
#    * call read("s3.feature@PutFiles")

  Scenario Outline: [PERFORMANCE-<file>] Check if the Lambda has a good performance with <time> file
    Given def config = {file: <file>, time: <time>, memory:  <memory>}
    * print config
    When def result = invokeLambda(config.file, config.time, config.memory)
    Then match result contains "Successful"
    * print result
    Examples:
      | file     | time | memory |
      | baseline | 4000 | 128    |
      | load     | 3000 | 128    |