import { EMAIL_API_SECRET_KEY } from '@env';
import * as CryptoJS from 'crypto-js';

export function signRequest(
  method: string,
  path: string,
  timestamp: string,
  rawBody: string,
) {
  const secretKey = EMAIL_API_SECRET_KEY;
  if (!secretKey) {
    throw new Error('Secret key is not set');
  }

  const message = `${method}|${path}|${timestamp}|${rawBody}`;
  const hash = CryptoJS.HmacSHA256(message, secretKey);
  return CryptoJS.enc.Hex.stringify(hash);
}
