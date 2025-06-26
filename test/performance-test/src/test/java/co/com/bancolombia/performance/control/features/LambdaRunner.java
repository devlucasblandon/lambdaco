package co.com.bancolombia.performance.control.features;

import com.intuit.karate.junit5.Karate;

public class LambdaRunner {
    @Karate.Test
    Karate massive() {

        return Karate.run("control").relativeTo(getClass());
    }
}
