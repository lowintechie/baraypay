export class RielPayError extends Error {
  public readonly code: string;
  public readonly provider?: string;

  constructor(message: string, code = "RIELPAY_ERROR", provider?: string, cause?: unknown) {
    super(message, { cause });
    this.name = "RielPayError";
    this.code = code;
    this.provider = provider;
  }
}
