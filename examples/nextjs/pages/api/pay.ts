import type { NextApiRequest, NextApiResponse } from "next";
import { createRielPay, abaPayway } from "rielpay";

const rielpay = createRielPay({
  providers: [
    abaPayway({
      merchantId: process.env.ABA_MERCHANT_ID || "merchant_demo",
      apiKey: process.env.ABA_API_KEY || "api_key_demo",
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

  const payment = await rielpay.createPayment({
    provider: "aba",
    amount: Number(req.body.amount ?? 10),
    currency: String(req.body.currency ?? "USD"),
    orderId: String(req.body.orderId ?? `order_${Date.now()}`)
  });

  return res.status(200).json(payment);
}
