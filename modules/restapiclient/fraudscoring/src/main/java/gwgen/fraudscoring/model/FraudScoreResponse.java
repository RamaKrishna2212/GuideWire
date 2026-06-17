package gwgen.fraudscoring.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Response model for the Fraud Scoring API.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class FraudScoreResponse {

    @JsonProperty("score")
    private Integer score;

    @JsonProperty("riskDescription")
    private String riskDescription;

    public FraudScoreResponse() {
    }

    public FraudScoreResponse(Integer score, String riskDescription) {
        this.score = score;
        this.riskDescription = riskDescription;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getRiskDescription() {
        return riskDescription;
    }

    public void setRiskDescription(String riskDescription) {
        this.riskDescription = riskDescription;
    }

    @Override
    public String toString() {
        return "FraudScoreResponse{" +
                "score=" + score +
                ", riskDescription='" + riskDescription + '\'' +
                '}';
    }
}
