import { RielPayError } from "./errors.js";
import type { ProviderAdapter } from "./provider.js";
import type {
  CreatePaymentInput,
  GenerateKHQRInput,
  VerifyPaymentInput,
  WebhookInput
} from "./types.js";

export interface RielPayConfig {
  providers: ProviderAdapter[];
}

export interface RielPayClient {
  listProviders(): string[];
  createPayment(input: CreatePaymentInput): ReturnType<NonNullable<ProviderAdapter["createPayment"]>>;
  verifyPayment(input: VerifyPaymentInput): ReturnType<NonNullable<ProviderAdapter["verifyPayment"]>>;
  generateKHQR(input: GenerateKHQRInput): ReturnType<NonNullable<ProviderAdapter["generateKHQR"]>>;
  webhookHandler(input: WebhookInput): ReturnType<NonNullable<ProviderAdapter["webhookHandler"]>>;
}

export function createRielPay(config: RielPayConfig): RielPayClient {
  const registry = new Map<string, ProviderAdapter>();

  for (const provider of config.providers) {
    if (registry.has(provider.id)) {
      throw new RielPayError(
        `Duplicate provider id '${provider.id}'`,
        "DUPLICATE_PROVIDER",
        provider.id
      );
    }
    registry.set(provider.id, provider);
  }

  const getProvider = (id: string): ProviderAdapter => {
    const provider = registry.get(id);
    if (!provider) {
      throw new RielPayError(`Provider '${id}' is not registered`, "PROVIDER_NOT_FOUND", id);
    }
    return provider;
  };

  return {
    listProviders() {
      return [...registry.keys()];
    },

    async createPayment(input) {
      const provider = getProvider(input.provider);
      if (!provider.createPayment) {
        throw new RielPayError(
          `Provider '${input.provider}' does not support createPayment`,
          "METHOD_NOT_SUPPORTED",
          input.provider
        );
      }
      return provider.createPayment(input);
    },

    async verifyPayment(input) {
      const provider = getProvider(input.provider);
      if (!provider.verifyPayment) {
        throw new RielPayError(
          `Provider '${input.provider}' does not support verifyPayment`,
          "METHOD_NOT_SUPPORTED",
          input.provider
        );
      }
      return provider.verifyPayment(input);
    },

    async generateKHQR(input) {
      const provider = getProvider(input.provider);
      if (!provider.generateKHQR) {
        throw new RielPayError(
          `Provider '${input.provider}' does not support generateKHQR`,
          "METHOD_NOT_SUPPORTED",
          input.provider
        );
      }
      return provider.generateKHQR(input);
    },

    async webhookHandler(input) {
      const provider = getProvider(input.provider);
      if (!provider.webhookHandler) {
        throw new RielPayError(
          `Provider '${input.provider}' does not support webhookHandler`,
          "METHOD_NOT_SUPPORTED",
          input.provider
        );
      }
      return provider.webhookHandler(input);
    }
  };
}
