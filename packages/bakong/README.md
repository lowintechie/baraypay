# @rielpay/bakong

Bakong KHQR provider adapter for RielPay.

```ts
import { createRielPay } from "@rielpay/sdk";
import { bakongKHQR } from "@rielpay/bakong";

const rielpay = createRielPay({
  providers: [
    bakongKHQR({
      merchantId: "merchant_xxx",
      merchantName: "Demo Merchant"
    })
  ]
});
```
