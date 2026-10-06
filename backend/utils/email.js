const MAILJET_API_URL = "https://api.mailjet.com/v3.1/send";

const sendOTP = async (email, otp) => {
  const appName = "PortfolioAI";
  const apiKey = process.env.MAILJET_API_KEY;
  const secretKey = process.env.MAILJET_SECRET_KEY;
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || "satyasrikarri457@gmail.com";

  if (!apiKey || !secretKey) {
    throw new Error("Email delivery is not configured.");
  }

  const body = {
    Messages: [
      {
        From: { Email: from, Name: appName },
        To: [{ Email: email }],
        Subject: `Your ${appName} OTP`,
        TextPart: `Your OTP is: ${otp}. It expires in 5 minutes.`,
        HTMLPart: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0f0f1a;border-radius:16px;color:#fff">
            <div style="font-size:28px;margin-bottom:8px">◈ PortfolioAI</div>
            <p style="color:rgba(255,255,255,0.7);font-size:14px">Use the OTP below to sign in. Expires in 5 minutes.</p>
            <div style="font-size:42px;font-weight:800;letter-spacing:8px;text-align:center;padding:24px;margin:20px 0;background:rgba(255,255,255,0.06);border-radius:12px;color:#fff">${otp}</div>
            <p style="color:rgba(255,255,255,0.4);font-size:12px">If you didn't request this, ignore this email.</p>
          </div>
        `,
      },
    ],
  };

  try {
    const auth = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    const resp = await fetch(MAILJET_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!resp.ok) {
        throw new Error(`Email provider returned ${resp.status}`);
    }
    const data = await resp.json();
    const msg = data?.Messages?.[0];
    if (msg && msg.Status !== "success") {
      throw new Error(`Mailjet: ${JSON.stringify(msg.Errors || msg)}`);
    }
  } catch (err) {
    throw new Error("Email delivery failed.");
  }
};

module.exports = { sendOTP };
