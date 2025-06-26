Feature: Generate automations Acceptance test

  Background:
    * def lambdaExecutor = call read('../lambda-client-factory.js') aws.lambda
    * def listenTimeout = timeout

  @ValidCreateAndEvaluateTransaction
  Scenario: Invoke nu0217001-simetrik-function-transportfile
    * print aws.lambda.functionName
    * listen listenTimeout

    * def invokeFunction = lambdaExecutor.invokeLambda()
    And match invokeFunction ==  200

