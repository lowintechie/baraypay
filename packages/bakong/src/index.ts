import type { ProviderAdapter } from "@rielpay/sdk";
import { RielPayError } from "@rielpay/sdk";
import { buildKHQRString } from "./khqr.js";
import { normalizeBakongStatus } from "./mapper.js";
import type { BakongConfig } from "./types.js";

export function bakongKHQR(config: BakongConfig): ProviderAdapter {
  return {
    id: "bakong",

    async generateKHQR(input) {
      const qrString = buildKHQRString(input, config);
      return {
        provider: "bakong",
        qrString,
        raw: {
          merchantId: config.merchantId,
          merchantName: config.merchantName,
          billNumber: input.billNumber
        }
      };
    },

    async createPayment(input) {
      const qr = await this.generateKHQR?.({
        provider: "bakong",
        amount: input.amount,
        currency: input.currency,
        merchantName: config.merchantName,
        billNumber: input.orderId,
        storeLabel: "RielPay"
      });

      if (!qr) {
        throw new RielPayError("Bakong KHQR generation failed", "KHQR_GENERATION_FAILED", "bakong");
      }

      return {
        provider: "bakong",
        transactionId: `bakong_${input.orderId}`,
        qrCode: qr.qrString,
        status: "pending",
        raw: qr.raw
      };
    },

    async verifyPayment(input) {
      return {
        provider: "bakong",
        transactionId: input.transactionId,
        status: "pending",
        raw: {
          note: "Bakong verification endpoint not configured in this sample provider"
        }
      };
    },

    async webhookHandler(input) {
      let payload: any;
      try {
        payload = JSON.parse(input.rawBody.toString("utf8"));
      } catch (error) {
        throw new RielPayError("Invalid Bakong webhook JSON body", "INVALID_WEBHOOK_BODY", "bakong", error);
      }

      const status = normalizeBakongStatus(payload.status);

      return {
        provider: "bakong",
        eventType:
          status === "succeeded"
            ? "payment.succeeded"
            : status === "failed"
            ? "payment.failed"
            : "payment.pending",
        transactionId: String(payload.transactionId ?? payload.billNumber ?? ""),
        orderId: payload.orderId ? String(payload.orderId) : undefined,
        status,
        raw: payload
      };
    }
  };
}

export type { BakongConfig } from "./types.js";
