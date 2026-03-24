import type {
  CreatePaymentInput,
  VerificationResult,
  WebhookEvent,
  PaymentStatus
} from "@rielpay/sdk";
import type { AbaCreatePaymentResponse } from "./types.js";

export function mapCreatePaymentToAbaPayload(input: CreatePaymentInput, merchantId: string) {
  return {
    merchant_id: merchantId,
    amount: input.amount,
    currency: input.currency,
    order_id: input.orderId,
    description: input.description,
    return_url: input.returnUrl,
    metadata: input.metadata
  };
}

export function mapAbaStatus(status: string): PaymentStatus {
  const normalized = status.toLowerCase();
  if (["success", "succeeded", "paid", "completed"].includes(normalized)) {
    return "succeeded";
  }
  if (["fail", "failed", "declined"].includes(normalized)) {
    return "failed";
  }
  if (["expired"].includes(normalized)) {
    return "expired";
  }
  if (["cancelled", "canceled"].includes(normalized)) {
    return "cancelled";
  }
  return "pending";
}

export function mapAbaCreateResponse(response: AbaCreatePaymentResponse) {
  return {
    provider: "aba" as const,
    transactionId: response.transactionId,
    checkoutUrl: response.checkoutUrl,
    qrCode: response.qrCode,
    status: mapAbaStatus(response.status),
    raw: response
  };
}

export function mapAbaVerifyResponse(raw: any, transactionId: string): VerificationResult {
  return {
    provider: "aba",
    transactionId,
    status: mapAbaStatus(raw.status ?? "pending"),
    paidAmount: typeof raw.paidAmount === "number" ? raw.paidAmount : undefined,
    paidCurrency: typeof raw.paidCurrency === "string" ? raw.paidCurrency : undefined,
    raw
  };
}

export function mapAbaWebhook(raw: any): WebhookEvent {
  const status = mapAbaStatus(raw.status ?? "pending");
  const eventType =
    status === "succeeded"
      ? "payment.succeeded"
      : status === "failed"
      ? "payment.failed"
      : "payment.pending";

  return {
    provider: "aba",
    eventType,
    transactionId: String(raw.transactionId ?? raw.trans_id ?? ""),
    orderId: raw.orderId ? String(raw.orderId) : undefined,
    status,
    raw
  };
}
