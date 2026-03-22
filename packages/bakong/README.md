# @baraypay/bakong

Bakong KHQR provider adapter for BarayPay.

```ts
import { createBarayPay } from "@baraypay/sdk";
import { bakongKHQR } from "@baraypay/bakong";

const baraypay = createBarayPay({
  providers: [
    bakongKHQR({
      merchantId: "merchant_xxx",
      merchantName: "Demo Merchant"
    })
  ]
});
```
