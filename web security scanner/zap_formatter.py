def format_zap_output(zap_raw: dict):
    alerts = zap_raw.get("alerts", [])

    risk_levels = []
    reasons = []

    for alert in alerts:
        name = alert.get("name", "").lower()
        risk = alert.get("risk", "")

        if risk:
            risk_levels.append(risk)

        if "content security policy" in name:
            reasons.append("No Content Security Policy (CSP)")
        elif "clickjacking" in name:
            reasons.append("Missing Anti-Clickjacking Protection")
        elif "anti-csrf" in name or "csrf" in name:
            reasons.append("No Anti-CSRF Tokens Found")
        elif "cross site scripting" in name or "xss" in name:
            reasons.append("Cross-Site Scripting (XSS)")
        elif "sql injection" in name:
            reasons.append("SQL Injection Risk")

    # Overall risk
    if "High" in risk_levels:
        overall_risk = "High"
    elif "Medium" in risk_levels:
        overall_risk = "Medium"
    else:
        overall_risk = "Low"

    # Verdict
    verdict = "⚠️ Suspicious Website" if overall_risk in ["High", "Medium"] else "✅ Looks Safe"

    return {
        "verdict": verdict,
        "risk_level": overall_risk,
        "reasons": list(dict.fromkeys(reasons))[:3],  # top 3 unique
        "scanner": "OWASP ZAP (Real-time)"
    }
