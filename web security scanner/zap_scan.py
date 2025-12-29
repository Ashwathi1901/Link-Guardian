import requests
import time

ZAP_API = "http://127.0.0.1:8090"

def scan_url(url: str):
    try:
        # 1. Access URL
        requests.get(
            f"{ZAP_API}/JSON/core/action/accessUrl/",
            params={"url": url},
            timeout=10
        )

        # 2. Spider
        requests.get(
            f"{ZAP_API}/JSON/spider/action/scan/",
            params={"url": url},
            timeout=10
        )

        time.sleep(5)

        # 3. Get alerts
        alerts = requests.get(
            f"{ZAP_API}/JSON/core/view/alerts/",
            params={"baseurl": url},
            timeout=10
        ).json()

        return alerts

    except Exception as e:
        return {"error": str(e)}
