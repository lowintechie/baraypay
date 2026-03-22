# @baraypay/abapayway

ABA PayWay provider adapter for BarayPay.

```ts
import { createBarayPay } from "@baraypay/sdk";
import { abaPayway } from "@baraypay/abapayway";

const baraypay = createBarayPay({
  providers: [
    abaPayway({
      merchantId: "merchant_xxx",
      apiKey: "secret",
      environment: "sandbox"
    })
  ]
});
```
