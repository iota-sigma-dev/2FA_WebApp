/**
 * Implementación TOTP (RFC 6238) usando Web Crypto API nativa.
 * Sin dependencias de Node.js. Compatible con Google y Microsoft Authenticator.
 */

/** Decodifica un secreto en formato Base32 a Uint8Array */
function base32Decode(base32: string): Uint8Array {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const input = base32.toUpperCase().replace(/=+$/, '');
  let bits = 0;
  let value = 0;
  let index = 0;
  const output = new Uint8Array(Math.floor((input.length * 5) / 8));

  for (let i = 0; i < input.length; i++) {
    const charIndex = chars.indexOf(input[i]);
    if (charIndex === -1) continue;
    value = (value << 5) | charIndex;
    bits += 5;
    if (bits >= 8) {
      output[index++] = (value >>> (bits - 8)) & 255;
      bits -= 8;
    }
  }

  return output;
}

/** Convierte un número entero a un buffer de 8 bytes (big-endian) */
function intToBuffer(num: number): ArrayBuffer {
  const buf = new ArrayBuffer(8);
  const view = new DataView(buf);
  // JavaScript no maneja enteros de 64-bit nativamente.
  // Los tokens TOTP no necesitarán el high word por siglos.
  view.setUint32(4, num & 0xffffffff, false);
  view.setUint32(0, Math.floor(num / 0x100000000) & 0xffffffff, false);
  return buf;
}

/**
 * Genera un token TOTP de 6 dígitos.
 * Equivalente a lo que muestra Google/Microsoft Authenticator.
 */
export async function generateTOTP(secret: string): Promise<string> {
  const keyBytes = base32Decode(secret);
  const epoch = Math.floor(Date.now() / 1000);
  const counter = Math.floor(epoch / 30);
  const counterBuffer = intToBuffer(counter);

  // Copiar a un ArrayBuffer explícito para satisfacer los tipos de Web Crypto API
  const keyBuffer = keyBytes.buffer.slice(
    keyBytes.byteOffset,
    keyBytes.byteOffset + keyBytes.byteLength
  ) as ArrayBuffer;

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const hmacResult = await crypto.subtle.sign('HMAC', cryptoKey, counterBuffer);
  const hmac = new Uint8Array(hmacResult);

  // Dynamic Truncation (RFC 4226)
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const token = code % 1_000_000;
  return token.toString().padStart(6, '0');
}

/** Retorna los segundos restantes en el período TOTP actual (0–30) */
export function getTimeRemaining(): number {
  const epoch = Math.floor(Date.now() / 1000);
  return 30 - (epoch % 30);
}
