import type { ProviderAdapter } from "@rielpay/sdk";
import { RielPayError, jsonRequest } from "@rielpay/sdk";
import { mapAbaCreateResponse, mapAbaVerifyResponse, mapAbaWebhook, mapCreatePaymentToAbaPayload } from "./mapper.js";
import { hmacSHA256Hex, safeCompareHex } from "./signer.js";
import type { AbaPaywayConfig } from "./types.js";

function getBaseUrl(config: AbaPaywayConfig): string {
  if (config.baseUrl) {
    return config.baseUrl;
  }
  return config.environment === "production"
    ? "https://checkout.payway.com.kh/api"
    : "https://checkout-sandbox.payway.com.kh/api";
}

function buildMockTransactionId(orderId: string): string {
  return `aba_mock_${orderId}_${Date.now()}`;
}

export function abaPayway(config: AbaPaywayConfig): ProviderAdapter {
  const baseUrl = getBaseUrl(config);

  return {
    id: "aba",

    async createPayment(input) {
      if (config.mock) {
        return {
          provider: "aba",
          transactionId: buildMockTransactionId(input.orderId),
          checkoutUrl: `https://sandbox.example/aba/checkout/${input.orderId}`,
          qrCode: `ABA_MOCK_QR_${input.orderId}`,
          status: "pending",
          raw: { mock: true }
        };
      }

      const payload = mapCreatePaymentToAbaPayload(input, config.merchantId);
      const signature = hmacSHA256Hex(config.apiKey, JSON.stringify(payload));

      const response = await jsonRequest<any>(`${baseUrl}/payment-link/create`, {
        method: "POST",
        headers: {
          authorization: `HMAC ${signature}`
        },
        body: payload
      });

      return mapAbaCreateResponse({
        transactionId: String(response.transactionId ?? response.trans_id ?? ""),
        checkoutUrl: typeof response.checkoutUrl === "string" ? response.checkoutUrl : undefined,
        qrCode: typeof response.qrCode === "string" ? response.qrCode : undefined,
        status: String(response.status ?? "pending")
      });
    },

    async verifyPayment(input) {
      if (config.mock) {
        return {
          provider: "aba",
          transactionId: input.transactionId,
          status: "succeeded",
          paidAmount: 10,
          paidCurrency: "USD",
          raw: { mock: true }
        };
      }

      const payload = {
        merchant_id: config.merchantId,
        transaction_id: input.transactionId,
        order_id: input.orderId
      };
      const signature = hmacSHA256Hex(config.apiKey, JSON.stringify(payload));

      const response = await jsonRequest<any>(`${baseUrl}/payment/check-transaction`, {
        method: "POST",
        headers: {
          authorization: `HMAC ${signature}`
        },
        body: payload
      });

      return mapAbaVerifyResponse(response, input.transactionId);
    },

    async webhookHandler(input) {
      const signatureHeader = input.headers["x-aba-signature"];
      const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;

      if (config.webhookSecret) {
        if (!signature) {
          throw new RielPayError("Missing ABA webhook signature", "INVALID_WEBHOOK_SIGNATURE", "aba");
        }

        const computed = hmacSHA256Hex(config.webhookSecret, input.rawBody);
        if (!safeCompareHex(computed, signature)) {
          throw new RielPayError("Invalid ABA webhook signature", "INVALID_WEBHOOK_SIGNATURE", "aba");
        }
      }

      let payload: any;
      try {
        payload = JSON.parse(input.rawBody.toString("utf8"));
      } catch (error) {
        throw new RielPayError("Invalid ABA webhook JSON body", "INVALID_WEBHOOK_BODY", "aba", error);
      }

      return mapAbaWebhook(payload);
    }
  };
}

export type { AbaPaywayConfig } from "./types.js";
