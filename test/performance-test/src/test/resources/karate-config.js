function fn(){
    var environment = karate.properties['environment'];
    var config = {
        environment: environment
    };
    return config;
}