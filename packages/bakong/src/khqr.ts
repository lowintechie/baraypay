import type { GenerateKHQRInput } from "@baraypay/sdk";
import type { BakongConfig } from "./types.js";

function tlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, "0");
  return `${id}${len}${value}`;
}

function crc16ccitt(input: string): string {
  let crc = 0xffff;
  for (let i = 0; i < input.length; i += 1) {
    crc ^= input.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j += 1) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function buildKHQRString(input: GenerateKHQRInput, config: BakongConfig): string {
  const payloadFormatIndicator = tlv("00", "01");
  const pointOfInitiationMethod = tlv("01", "12");

  const merchantAccountInfo = tlv(
    "29",
    [
      tlv("00", "kh.gov.nbc.bakong"),
      tlv("01", config.merchantId),
      tlv("02", input.billNumber ?? input.merchantName)
    ].join("")
  );

  const transactionCurrency = tlv("53", input.currency === "USD" ? "840" : "116");
  const transactionAmount = tlv("54", input.amount.toFixed(2));
  const countryCode = tlv("58", "KH");
  const merchantName = tlv("59", (config.merchantName || input.merchantName).slice(0, 25));
  const merchantCity = tlv("60", (input.storeLabel ?? "Phnom Penh").slice(0, 15));

  const additionalData = tlv(
    "62",
    [
      tlv("01", input.billNumber ?? ""),
      tlv("05", input.storeLabel ?? "BarayPay")
    ].join("")
  );

  const withoutCrc = [
    payloadFormatIndicator,
    pointOfInitiationMethod,
    merchantAccountInfo,
    transactionCurrency,
    transactionAmount,
    countryCode,
    merchantName,
    merchantCity,
    additionalData,
    "6304"
  ].join("");

  return `${withoutCrc}${crc16ccitt(withoutCrc)}`;
}
