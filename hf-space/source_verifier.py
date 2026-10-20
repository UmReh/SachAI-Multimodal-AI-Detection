import os

import requests
from dotenv import load_dotenv

load_dotenv()

GOOGLE_FACT_CHECK_API_KEY = os.getenv("GOOGLE_FACT_CHECK_API_KEY")


def verify_claim_with_google(claim):
    if not GOOGLE_FACT_CHECK_API_KEY:
        return {
            "verified": False,
            "error": "GOOGLE_FACT_CHECK_API_KEY is not set",
        }

    url = "https://factchecktools.googleapis.com/v1alpha1/claims:search"

    params = {
        "query": claim,
        "key": GOOGLE_FACT_CHECK_API_KEY,
        "languageCode": "en"
    }

    try:
        response = requests.get(url, params=params, timeout=10)
    except requests.RequestException as e:
        return {
            "verified": False,
            "error": str(e)
        }

    if response.status_code != 200:
        return {
            "verified": False,
            "error": response.text
        }

    data = response.json()

    claims = data.get("claims", [])

    if not claims:
        return {
            "verified": False,
            "message": "No fact-check data found."
        }

    first_claim = claims[0]

    claimant = first_claim.get("claimant", "Unknown")
    text = first_claim.get("text", claim)

    reviews = first_claim.get("claimReview", [])

    if reviews:
        review = reviews[0]

        return {
            "verified": True,
            "claim": text,
            "claimant": claimant,
            "publisher": review.get("publisher", {}).get("name", "Unknown"),
            "rating": review.get("textualRating", "Unknown"),
            "url": review.get("url", "")
        }

    return {
        "verified": False,
        "message": "Claim found but no review available."
    }
