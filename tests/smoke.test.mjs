import test from "node:test";
import assert from "node:assert/strict";

import { createBarayPay, abaPayway, bakongKHQR } from "../packages/baraypay/dist/index.js";

test("createPayment via ABA provider in mock mode", async () => {
  const client = createBarayPay({
    providers: [
      abaPayway({
        merchantId: "m_123",
        apiKey: "k_123",
        environment: "sandbox",
        mock: true
      })
    ]
  });

  const payment = await client.createPayment({
    provider: "aba",
    amount: 10,
    currency: "USD",
    orderId: "order_123"
  });

  assert.equal(payment.provider, "aba");
  assert.equal(payment.status, "pending");
  assert.ok(payment.transactionId.length > 0);
});

test("generateKHQR via Bakong provider", async () => {
  const client = createBarayPay({
    providers: [
      bakongKHQR({
        merchantId: "bk_merchant",
        merchantName: "Bakong Test Merchant"
      })
    ]
  });

  const qr = await client.generateKHQR({
    provider: "bakong",
    amount: 45000,
    currency: "KHR",
    merchantName: "Bakong Test Merchant",
    billNumber: "INV-1"
  });

  assert.equal(qr.provider, "bakong");
  assert.ok(qr.qrString.startsWith("000201"));
});
