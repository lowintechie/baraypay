# rielpay

All-in-one RielPay package.

Install once:

```bash
npm install rielpay
```

Use unified API + providers from one import:

```ts
import { createRielPay, abaPayway, bakongKHQR } from "rielpay";
```

Or optional subpath imports:

```ts
import { abaPayway } from "rielpay/abapayway";
import { bakongKHQR } from "rielpay/bakong";
```
