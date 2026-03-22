import express from "express";
import { createBarayPay, abaPayway, bakongKHQR } from "baraypay";

const app = express();

const baraypay = createBarayPay({
  providers: [
    abaPayway({
      merchantId: process.env.ABA_MERCHANT_ID || "merchant_demo",
      apiKey: process.env.ABA_API_KEY || "api_key_demo",
      environment: "sandbox",
      webhookSecret: process.env.ABA_WEBHOOK_SECRET,
      mock: true
    }),
    bakongKHQR({
      merchantId: process.env.BAKONG_MERCHANT_ID || "bakong_demo",
      merchantName: "BarayPay Express Shop"
    })
  ]
});

app.use(express.json());

app.post("/pay/aba", async (req, res) => {
  const payment = await baraypay.createPayment({
    provider: "aba",
    amount: Number(req.body.amount ?? 10),
    currency: String(req.body.currency ?? "USD"),
    orderId: String(req.body.orderId ?? `order_${Date.now()}`),
    description: "BarayPay Express demo payment"
  });

  res.json(payment);
});

app.post("/pay/bakong/khqr", async (req, res) => {
  const qr = await baraypay.generateKHQR({
    provider: "bakong",
    amount: Number(req.body.amount ?? 40000),
    currency: String(req.body.currency ?? "KHR"),
    merchantName: "BarayPay Express Shop",
    billNumber: String(req.body.billNumber ?? `bill_${Date.now()}`)
  });

  res.json(qr);
});

app.post("/webhooks/aba", express.raw({ type: "*/*" }), async (req, res) => {
  try {
    const event = await baraypay.webhookHandler({
      provider: "aba",
      headers: req.headers,
      rawBody: req.body as Buffer
    });

    res.status(200).json({ ok: true, event });
  } catch (error) {
    res.status(400).json({ ok: false, message: (error as Error).message });
  }
});

app.listen(3000, () => {
  console.log("BarayPay Express demo running at http://localhost:3000");
});
