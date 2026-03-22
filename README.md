# BarayPay

A unified TypeScript SDK for Cambodian payments.

Supported providers:
- ABA PayWay
- Bakong KHQR

## Installation

```bash
npm install baraypay
```

## Quick Start

```ts
import { createBarayPay, abaPayway, bakongKHQR } from "baraypay";

const baraypay = createBarayPay({
  providers: [
    abaPayway({
      merchantId: process.env.ABA_MERCHANT_ID!,
      apiKey: process.env.ABA_API_KEY!,
      environment: "sandbox"
    }),
    bakongKHQR({
      merchantId: process.env.BAKONG_MERCHANT_ID!,
      merchantName: "BarayPay Demo Merchant"
    })
  ]
});

const payment = await baraypay.createPayment({
  provider: "aba",
  amount: 10,
  currency: "USD",
  orderId: "order_123"
});

console.log(payment);
```

## Unified API

- `createPayment()`
- `verifyPayment()`
- `generateKHQR()`
- `webhookHandler()`

## Express Example

See: `examples/express/src/server.ts`

## Next.js API Routes Example

See: `examples/nextjs/pages/api/pay.ts` and `examples/nextjs/pages/api/webhooks/aba.ts`

## Development

```bash
npm install
npm run build
npm test
```

## Roadmap

- More providers (local banks and wallets)
- Webhook replay protection helper
- Idempotency layer
- Event emitter hooks
- Optional framework adapters (NestJS/Fastify)

## Advanced (Optional)

If you want separate provider packages, you can also use:

- `@baraypay/sdk`
- `@baraypay/abapayway`
- `@baraypay/bakong`
