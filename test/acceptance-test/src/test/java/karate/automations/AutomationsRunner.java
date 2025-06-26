package karate.automations;

import com.intuit.karate.junit5.Karate;


public class AutomationsRunner {

    private final String PATH = "automations";
    @Karate.Test
    Karate automations() {
        return Karate.run(PATH).relativeTo(getClass());
    }
}