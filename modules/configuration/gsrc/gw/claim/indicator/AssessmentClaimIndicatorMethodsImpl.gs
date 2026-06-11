package gw.claim.indicator

uses gw.api.claim.indicator.ClaimIndicatorMethodsImpl
uses gw.api.locale.DisplayKey
uses gw.assessment.AssessmentDisplayHelper

@Export
class AssessmentClaimIndicatorMethodsImpl extends ClaimIndicatorMethodsImpl {
  /**
   * Constructor, called when an indicator is created or read from the database
   */
  construct(inIndicator : AssessmentClaimIndicator) {
    super(inIndicator, "risk_analysis")
  }

  /**
   * Update, sets the indicator on if the claim has any assessments with "high"
   */
  override function update() {
    var highRiskAssessments = AssessmentDisplayHelper.getHighRiskAssessmentsForIndicatorUpdate(Indicator.Claim)
    (Indicator as AssessmentClaimIndicator).NumHighRiskAssessments = highRiskAssessments.Count
    setOn(highRiskAssessments.HasElements)
  }

  /**
   * Text label, returns the description of the claim assessment status
   */
  override property get Text() : String {
    return Indicator.IsOn ? DisplayKey.get("Web.Claim.AssessmentClaimIndicator.OnText", (Indicator as AssessmentClaimIndicator).NumHighRiskAssessments) : null
  }

  /**
   * Hover text, returns the description of the claim assessment status
   */
  override property get HoverText() : String {
    return Indicator.IsOn ? DisplayKey.get("Web.Claim.AssessmentClaimIndicator.HelpText", (Indicator as AssessmentClaimIndicator).NumHighRiskAssessments) : null
  }
}