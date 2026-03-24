# @rielpay/abapayway

ABA PayWay provider adapter for RielPay.

```ts
import { createRielPay } from "@rielpay/sdk";
import { abaPayway } from "@rielpay/abapayway";

const rielpay = createRielPay({
  providers: [
    abaPayway({
      merchantId: "merchant_xxx",
      apiKey: "secret",
      environment: "sandbox"
    })
  ]
});
```
