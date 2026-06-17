package gw.api.fraud

/**
 * Holds the result of a fraud scoring API call.
 * Status indicates the outcome: SUCCESS, NOT_FOUND, ERROR, or SKIPPED.
 */
@Export
class FraudScoringResult {

  public static final var STATUS_SUCCESS : String = "SUCCESS"
  public static final var STATUS_NOT_FOUND : String = "NOT_FOUND"
  public static final var STATUS_ERROR : String = "ERROR"
  public static final var STATUS_SKIPPED : String = "SKIPPED"

  var _status : String as Status
  var _score : Integer as Score
  var _riskDescription : String as RiskDescription

  /**
   * Constructor for SUCCESS result with score and description.
   */
  construct(status : String, score : Integer, riskDescription : String) {
    _status = status
    _score = score
    _riskDescription = riskDescription
  }

  /**
   * Constructor for non-success results (NOT_FOUND, ERROR, SKIPPED).
   */
  construct(status : String) {
    _status = status
    _score = null
    _riskDescription = null
  }

  /**
   * Returns true if the fraud score indicates high risk (score >= 4).
   */
  property get IsHighRisk() : boolean {
    return _status == STATUS_SUCCESS and _score != null and _score >= 4
  }

  /**
   * Creates a SUCCESS result.
   */
  static function success(score : Integer, riskDescription : String) : FraudScoringResult {
    return new FraudScoringResult(STATUS_SUCCESS, score, riskDescription)
  }

  /**
   * Creates a NOT_FOUND result.
   */
  static function notFound() : FraudScoringResult {
    return new FraudScoringResult(STATUS_NOT_FOUND)
  }

  /**
   * Creates an ERROR result.
   */
  static function error() : FraudScoringResult {
    return new FraudScoringResult(STATUS_ERROR)
  }

  /**
   * Creates a SKIPPED result.
   */
  static function skipped() : FraudScoringResult {
    return new FraudScoringResult(STATUS_SKIPPED)
  }
}
