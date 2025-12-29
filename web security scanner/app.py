from fastapi import FastAPI
from pydantic import BaseModel
from zap_scan import scan_url
from zap_formatter import format_zap_output

app = FastAPI()

class URLRequest(BaseModel):
    url: str

@app.post("/check")
def check_url(data: URLRequest):
    zap_raw = scan_url(data.url)
    final_output = format_zap_output(zap_raw)
    return final_output
