export interface AbaPaywayConfig {
  merchantId: string;
  apiKey: string;
  environment: "sandbox" | "production";
  baseUrl?: string;
  webhookSecret?: string;
  mock?: boolean;
}

export interface AbaCreatePaymentResponse {
  transactionId: string;
  checkoutUrl?: string;
  qrCode?: string;
  status: string;
}
