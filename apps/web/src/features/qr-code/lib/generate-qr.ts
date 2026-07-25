import QRCode from "qrcode";

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QrOptions {
  text: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
  size: number;
  darkColor: string;
  lightColor: string;
  margin: number;
}

export async function generateQrPng(options: QrOptions): Promise<string> {
  return QRCode.toDataURL(options.text, {
    errorCorrectionLevel: options.errorCorrectionLevel,
    width: options.size,
    margin: options.margin,
    color: { dark: options.darkColor, light: options.lightColor },
  });
}

export async function generateQrSvg(options: QrOptions): Promise<string> {
  return QRCode.toString(options.text, {
    type: "svg",
    errorCorrectionLevel: options.errorCorrectionLevel,
    width: options.size,
    margin: options.margin,
    color: { dark: options.darkColor, light: options.lightColor },
  });
}
