import type { PaymentStatus } from "@baraypay/sdk";

export function normalizeBakongStatus(status?: string): PaymentStatus {
  const value = (status ?? "pending").toLowerCase();
  if (value === "success" || value === "succeeded" || value === "paid") {
    return "succeeded";
  }
  if (value === "failed") {
    return "failed";
  }
  return "pending";
}
