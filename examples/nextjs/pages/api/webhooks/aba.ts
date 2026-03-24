import type { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import { createRielPay, abaPayway } from "rielpay";

export const config = {
  api: {
    bodyParser: false
  }
};

const rielpay = createRielPay({
  providers: [
    abaPayway({
      merchantId: process.env.ABA_MERCHANT_ID || "merchant_demo",
      apiKey: process.env.ABA_API_KEY || "api_key_demo",
      webhookSecret: process.env.ABA_WEBHOOK_SECRET,
      environment: "sandbox",
      mock: true
    })
  ]
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const rawBody = await getRawBody(req);
    const event = await rielpay.webhookHandler({
      provider: "aba",
      headers: req.headers,
      rawBody
    });

    return res.status(200).json({ ok: true, event });
  } catch (error) {
    return res.status(400).json({ ok: false, message: (error as Error).message });
  }
}
