def generate_ai_explanation(model_prediction, model_confidence, fact_check):
    """
    Creates human-readable explanation using classifier + Google Fact Check data
    """

    confidence = model_confidence

    # If Google Fact Check verified the claim
    if fact_check.get("verified"):
        publisher = fact_check.get("publisher", "a fact-checking source")
        rating = fact_check.get("rating", "unverified")
        url = fact_check.get("url", "")

        rating_lower = rating.lower()

        if rating_lower == "false":
            final_verdict = "FAKE"
            verdict_color = "red"

        elif "mostly false" in rating_lower:
            final_verdict = "MISLEADING"
            verdict_color = "orange"

        elif "misleading" in rating_lower:
            final_verdict = "MISLEADING"
            verdict_color = "orange"

        elif rating_lower == "true":
            final_verdict = "REAL"
            verdict_color = "green"

        elif "mostly true" in rating_lower:
            final_verdict = "REAL"
            verdict_color = "green"

        else:
            final_verdict = "NEEDS CONTEXT"
            verdict_color = "yellow"

        if final_verdict == "FAKE":
            explanation = (
                f"{publisher} reviewed this claim and rated it '{rating}'. "
                "The claim contains misinformation and contradicts verified fact-checking sources."
            )
        
        elif final_verdict == "MISLEADING":
            explanation = (
                f"{publisher} reviewed this claim and rated it '{rating}'. "
                "The claim may contain partial truths but is presented in a misleading or incomplete way."
            )
        
        elif final_verdict == "REAL":
            explanation = (
                f"{publisher} reviewed this claim and rated it '{rating}'. "
                "The claim aligns with verified reporting and appears credible."
            )
        
        else:
            explanation = (
                f"{publisher} reviewed this claim and rated it '{rating}'. "
                "Additional context is needed to fully assess this claim."
            )

        return {
            "final_verdict": final_verdict,
            "verdict_color": verdict_color,
            "explanation": explanation,
            "source_url": url,
            "source_publisher": publisher
        }

    # Fallback if no fact-check data
    if model_prediction == "FAKE":
        final_verdict = "FAKE"
        verdict_color = "red"

        explanation = (
            f"The classifier flagged this content as potentially fake with {confidence}% confidence. "
            "No direct fact-check source was found, so manual verification is recommended."
        )

    else:
        final_verdict = "REAL"
        verdict_color = "green"

        explanation = (
            f"The classifier found this content likely credible with {confidence}% confidence. "
            "However, no direct fact-check source was found."
        )

    return {
        "final_verdict": final_verdict,
        "verdict_color": verdict_color,
        "explanation": explanation,
        "source_url": None,
        "source_publisher": None
    }