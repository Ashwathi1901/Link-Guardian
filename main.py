from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pickle
import numpy as np
import google.generativeai as genai
import json
from urllib.parse import urlparse
import requests
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import traceback
from fastapi import HTTPException


app = FastAPI(title="🔍 LinkGuardian Ultimate")

#CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = "AIzaSyBtSHFyHQxBiLc2v49OxpDFwKIvqbMRwas"  # From aistudio.google.com
genai.configure(api_key=GEMINI_API_KEY)
gemini = genai.GenerativeModel('gemini-1.5-flash')


email_model = joblib.load('email_model.joblib')
email_tfidf = joblib.load('email_content_converting_to_numbers.pkl')
keywords = joblib.load('Email_phishing_keywords.pkl')  
url_model = joblib.load('url_model.joblib')

class ScanRequest(BaseModel):
    email: str = ""
    url: str = ""
    zap_service_url: str = ""

def extract_url_features(url):
    """SINGLE FUNCTION - Uses your URL model features"""
    try:
        parsed = urlparse(url if url.startswith('http') else 'http://' + url)
        # Standard phishing features (matches most URL models)
        features = [
            len(url),                           # Length
            url.count('.'),                     # Dots
            int(url.startswith('http')),        # Protocol
            int('https' not in url),            # No HTTPS
            url.count('-'),                     # Hyphens
            url.count('%'),                     # Encoding
            len(parsed.netloc or ''),           # Domain length
            parsed.netloc.count('.') if parsed.netloc else 0,  # Domain dots
            int('@' in url),                    # @ symbol
            len(parsed.path or '')              # Path length
        ]
        return np.array([features])
    except:
        return np.zeros((1, 10))

@app.post("/ultimate_scan")
def ultimate_scan(request: ScanRequest):
    try:
        print(
            f"DEBUG: email='{request.email[:50]}...', "
            f"url='{request.url}', zap='{request.zap_service_url}'"
        )

        # EMAIL MODEL
        email_risk = 0.0
        keywords_detected = []

        if request.email:
            email_vec = email_tfidf.transform([request.email.lower()])
            email_keywords = np.array([[1 if w in request.email.lower() else 0 for w in keywords]])
        
            email_dense = email_vec.toarray()

            # Ensure fixed size
            if email_dense.shape[1] >= 100:
                email_dense = email_dense[:, -100:]
            else:
                pad_width = 100 - email_dense.shape[1]
                email_dense = np.pad(email_dense, ((0,0),(0,pad_width)))

            email_combined = np.hstack([email_dense, email_keywords])

            email_risk = email_model.predict_proba(email_combined)[0][1]
            keywords_detected = [k for k, v in zip(keywords, email_keywords[0]) if v]
    
        # URL MODEL
        url_risk = 0.0
        if request.url:
            url_features = extract_url_features(request.url)
            url_risk = url_model.predict_proba(url_features)[0][1]
    
        final_risk = 0.6 * url_risk + 0.4 * email_risk
    
        return {
            "verdict": "PHISHING" if final_risk > 0.7 else "SAFE",
            "confidence": round(final_risk, 3),
            "email_risk": round(email_risk, 3),
            "url_risk": round(url_risk, 3),
            "keywords": keywords_detected,
            "security_scan": {"status": "security_scan_ready"}
        }

    except Exception as e:
        print("🔥 BACKEND CRASH:")
        print(str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e)) 

@app.get("/")
async def root():
    return {"status": "LinkGuardian AI LIVE"}

@app.get("/security-report", response_class=HTMLResponse)
def security_report():
    try:
        with open("ZAP-Report.html", "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return """
        <h1>🛡️ OWASP ZAP Report</h1>
        <p>Upload ZAP-Report.html to see full scan results!</p>
        """

  