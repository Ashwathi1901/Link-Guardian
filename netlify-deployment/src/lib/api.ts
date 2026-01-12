export interface ScanResult {
  overall_verdict: string;
  email_risk_score: number;
  url_risk_score: number;
  reasons?: string[];
  details?: any;
}

export async function scanTarget(email: string, url: string): Promise<ScanResult> {
  const BACKEND_URL = "https://python--ashna89an.replit.app/docs";
  const targetUrl = `${BACKEND_URL}/ultimate_scan`;
  
  try {
    // Adding a timeout and more descriptive logging
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      signal: controller.signal,
      body: JSON.stringify({ email, url }),
    });

    clearTimeout(id);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Connection Error:", error);
    
    if (error.name === 'AbortError') {
      throw new Error("Request timed out. The backend server is taking too long to respond.");
    }
    
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error(
        "Connection Refused. Most common reasons:\n" +
        "1. Backend Repl is 'Sleeping' (Open it in a new tab to wake it up)\n" +
        "2. CORS is not enabled in your Python main.py\n" +
        "3. Your Python server isn't running on port 8080/0.0.0.0"
      );
    }
    throw error;
  }
}
