package gwgen.fraudscoring.api;

import gwgen.fraudscoring.model.FraudScoreResponse;
import feign.Param;
import feign.RequestLine;

/**
 * Feign client interface for the Beacon Fraud Scoring API.
 */
public interface FraudScoreApi {

    /**
     * Get fraud score for an insured person.
     *
     * @param firstName   First name of the insured (required)
     * @param lastName    Last name of the insured (required)
     * @param dateOfBirth Date of birth (YYYY-MM-DD) (optional)
     * @param addressLine1 Address line 1 (optional)
     * @param city        City (optional)
     * @param postalCode  Postal code (optional)
     * @return FraudScoreResponse with score and risk description
     */
    @RequestLine("GET /fraud/score?firstName={firstName}&lastName={lastName}&dateOfBirth={dateOfBirth}&addressLine1={addressLine1}&city={city}&postalCode={postalCode}")
    FraudScoreResponse getFraudScore(
        @Param("firstName") String firstName,
        @Param("lastName") String lastName,
        @Param("dateOfBirth") String dateOfBirth,
        @Param("addressLine1") String addressLine1,
        @Param("city") String city,
        @Param("postalCode") String postalCode
    );
}
