"""
Beacon AI Fraud Scoring API Server
FastAPI server providing fraud score checks for ClaimCenter integration.
"""

import secrets
from datetime import date
from typing import Optional

from fastapi import FastAPI, Query, HTTPException, Depends, Request
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
from starlette.middleware.base import BaseHTTPMiddleware
import base64
import uvicorn

# ─── Swagger UI credentials ───
DOCS_USERNAME = "docsuser"
DOCS_PASSWORD = "{03j1aW£bPpd"

# ─── Watchlist data for deterministic scoring ───
WATCHLIST_NAMES = {"john smith", "jane doe", "fraud tester"}
WATCHLIST_ADDRESSES = {"123 fake street", "456 scam avenue", "789 fraud lane"}
WATCHLIST_DOB_YEARS = {1980, 1975, 1990}

# ─── Risk descriptions by score ───
RISK_DESCRIPTIONS = {
    1: "Very low risk - No adverse indicators found.",
    2: "Low risk - Minor indicators noted, no action required.",
    3: "Medium risk - Some indicators present, monitor recommended.",
    4: "High risk - Multiple adverse indicators found, review recommended.",
    5: "Very high risk - Strong fraud indicators detected, immediate review required."
}

app = FastAPI(
    title="Beacon Fraud Scoring API",
    description="External fraud scoring API used by ClaimCenter to check insured risk scores during FNOL.",
    version="1.0.0",
    docs_url=None,       # disable default docs
    redoc_url=None,       # disable default redoc
    openapi_url=None      # disable default openapi.json — we serve it ourselves
)


def _check_docs_auth(request: Request) -> bool:
    """Check Basic Auth for Swagger UI access."""
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Basic "):
        return False
    try:
        decoded = base64.b64decode(auth.split(" ", 1)[1]).decode("utf-8")
        username, password = decoded.split(":", 1)
        return secrets.compare_digest(username, DOCS_USERNAME) and secrets.compare_digest(password, DOCS_PASSWORD)
    except Exception:
        return False


@app.get("/openapi.json", include_in_schema=False)
async def get_openapi_json():
    """Serve OpenAPI spec without authentication."""
    return JSONResponse(
        get_openapi(
            title=app.title,
            version=app.version,
            description=app.description,
            routes=app.routes,
        )
    )


@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui(request: Request):
    """Swagger UI protected by Basic Auth."""
    if not _check_docs_auth(request):
        return HTMLResponse(
            content="Unauthorized",
            status_code=401,
            headers={"WWW-Authenticate": 'Basic realm="Swagger UI"'}
        )
    return get_swagger_ui_html(
        openapi_url="/openapi.json",
        title=app.title + " - Swagger UI"
    )


@app.get("/fraud/score", summary="Get fraud score for an insured person",
         description="Returns a fraud risk score (1-5) and risk description for the given insured details.")
async def get_fraud_score(
    firstName: str = Query(..., description="First name of the insured"),
    lastName: str = Query(..., description="Last name of the insured"),
    dateOfBirth: Optional[str] = Query(None, description="Date of birth of the insured (YYYY-MM-DD)"),
    addressLine1: Optional[str] = Query(None, description="First line of the insured's address"),
    city: Optional[str] = Query(None, description="City of the insured's address"),
    postalCode: Optional[str] = Query(None, description="Postal code of the insured's address"),
):
    # ─── Not Found trigger ───
    if lastName.strip().lower() == "notfound":
        raise HTTPException(status_code=404, detail="No fraud data found for the insured")

    # ─── Deterministic scoring ───
    score = 1  # baseline

    # Name match: +3
    full_name = f"{firstName.strip()} {lastName.strip()}".lower()
    if full_name in WATCHLIST_NAMES:
        score += 3

    # Watchlist address: +2
    if addressLine1 and addressLine1.strip().lower() in WATCHLIST_ADDRESSES:
        score += 2

    # DOB year: +1
    if dateOfBirth:
        try:
            dob = date.fromisoformat(dateOfBirth)
            if dob.year in WATCHLIST_DOB_YEARS:
                score += 1
        except ValueError:
            pass  # ignore invalid date format

    # Clamp to 1-5
    score = max(1, min(5, score))

    return {
        "score": score,
        "riskDescription": RISK_DESCRIPTIONS.get(score, "Unknown risk level.")
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8090)
