package gw.api.fraud

uses gw.api.util.ConfigAccess
uses gw.api.util.Logger
uses feign.Feign
uses feign.jackson.JacksonDecoder
uses feign.jackson.JacksonEncoder
uses feign.FeignException
uses gwgen.fraudscoring.api.FraudScoreApi
uses gwgen.fraudscoring.model.FraudScoreResponse

/**
 * Service class that calls the external Beacon Fraud Scoring API.
 * Returns a FraudScoringResult with the score, risk description, or error status.
 */
@Export
class FraudScoringService {

  private static final var LOG = Logger.forCategory("FraudScoringService")

  /**
   * Calls the fraud scoring API with the insured's details.
   */
  static function callFraudScoringApi(
      firstName : String,
      lastName : String,
      dateOfBirth : String,
      addressLine1 : String,
      city : String,
      postalCode : String
  ) : FraudScoringResult {

    // Validate required fields
    if (firstName == null or firstName.trim().length() == 0) {
      LOG.warn("firstName is empty — skipping fraud score API call")
      return FraudScoringResult.skipped()
    }
    if (lastName == null or lastName.trim().length() == 0) {
      LOG.warn("lastName is empty — skipping fraud score API call")
      return FraudScoringResult.skipped()
    }

    // Log warnings for optional fields
    if (dateOfBirth == null or dateOfBirth.trim().length() == 0) {
      LOG.warn("dateOfBirth is null or empty — proceeding without DOB")
    }
    if (addressLine1 == null or addressLine1.trim().length() == 0) {
      LOG.warn("addressLine1 is null or empty — proceeding without address")
    }

    // Read API base URL from config
    var baseUrl : String = null
    try {
      var configFile = ConfigAccess.getConfigFile("config/config.properties")
      if (configFile != null and configFile.exists()) {
        var props = new java.util.Properties()
        var fis = new java.io.FileInputStream(configFile)
        try {
          props.load(fis)
        } finally {
          fis.close()
        }
        baseUrl = props.getProperty("fraud.score.api.url")
      }
    } catch (e : java.lang.Exception) {
      LOG.error("Error reading config.properties: " + e.Message)
    }

    if (baseUrl == null or baseUrl.trim().length() == 0) {
      LOG.error("fraud.score.api.url is not configured — returning ERROR")
      return FraudScoringResult.error()
    }

    LOG.info("Calling Fraud Scoring API at: " + baseUrl)
    LOG.info("PII — firstName: " + firstName + ", lastName: " + lastName
        + ", dateOfBirth: " + dateOfBirth
        + ", addressLine1: " + addressLine1
        + ", city: " + city
        + ", postalCode: " + postalCode)

    // Build Feign client and call API
    try {
      var client = Feign.builder()
          .decoder(new JacksonDecoder())
          .encoder(new JacksonEncoder())
          .target(FraudScoreApi, baseUrl)

      var response = client.getFraudScore(
          firstName.trim(),
          lastName.trim(),
          dateOfBirth != null ? dateOfBirth.trim() : "",
          addressLine1 != null ? addressLine1.trim() : "",
          city != null ? city.trim() : "",
          postalCode != null ? postalCode.trim() : ""
      )

      if (response != null and response.getScore() != null) {
        var score = response.getScore()
        var riskDesc = response.getRiskDescription() != null ? response.getRiskDescription() : "No description"
        // Truncate if too long
        if (riskDesc.length() > 255) {
          riskDesc = riskDesc.substring(0, 255)
        }
        LOG.info("Fraud score received: " + score + ", riskDescription: " + riskDesc)
        return FraudScoringResult.success(score, riskDesc)
      } else {
        LOG.warn("Fraud scoring API returned null or empty response")
        return FraudScoringResult.error()
      }
    } catch (e : FeignException) {
      if (e.status() == 404) {
        LOG.info("Fraud scoring API returned 404 — no data found for insured")
        return FraudScoringResult.notFound()
      } else {
        LOG.error("Fraud scoring API call failed with status " + e.status() + ": " + e.Message)
        return FraudScoringResult.error()
      }
    } catch (e : java.lang.Exception) {
      LOG.error("Unexpected error calling fraud scoring API: " + e.Message)
      return FraudScoringResult.error()
    }
  }
}
