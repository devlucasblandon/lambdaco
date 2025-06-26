function fn() {
    const AwsProperties = Java.type('karate.infrastructure.aws.AwsProperties');
    const LambdaExecutor = Java.type('karate.infrastructure.aws.lambda.LambdaExecutor');

    const awsProperties = AwsProperties.fromMap(karate.get('aws'));

    return new LambdaExecutor(awsProperties);
}
