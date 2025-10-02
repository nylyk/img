import { base64URLdecode, base64URLencode } from './base64';
import { EncryptionError } from './errors';

const deriveKey = async (
  data: Uint8Array<ArrayBuffer>,
  iterationFactor: number,
): Promise<CryptoKey> => {
  const baseKey = await crypto.subtle.importKey('raw', data, 'PBKDF2', false, [
    'deriveKey',
  ]);

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: new Uint8Array(), // salt can be empty since the password is already randomly generated
      iterations: iterationFactor * 250000,
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  );
};

export const encrypt = async (
  data: Uint8Array<ArrayBuffer>,
): Promise<[string, string, number]> => {
  try {
    const keyData = crypto.getRandomValues(new Uint8Array(16));
    const iterationFactor = 3;
    const key = await deriveKey(keyData, iterationFactor);

    // combine iteration factor and key data into password
    const passwordData = new Uint8Array(keyData.byteLength + 1);
    new DataView(passwordData.buffer).setUint8(0, iterationFactor);
    passwordData.set(keyData, 1);
    const password = base64URLencode(passwordData);

    // encrypt
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      data,
    );

    // combine iv and cipher text
    const cipher = new Uint8Array(iv.byteLength + encryptedData.byteLength);
    cipher.set(iv, 0);
    cipher.set(new Uint8Array(encryptedData), iv.byteLength);

    return [cipher, password];
  } catch (e) {
    console.error(e);
    throw new EncryptionError();
  }
};

export const decrypt = async (
  data: Uint8Array,
  password: string,
): Promise<Uint8Array<ArrayBuffer>> => {
  try {
    const passwordData = base64URLdecode(password);
    const iterationFactor = new DataView(passwordData.buffer).getUint8(0);
    const key = await deriveKey(passwordData.slice(1), iterationFactor);

    const iv = data.slice(0, 12);
    const encryptedData = data.slice(12);

    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encryptedData,
    );

    return new Uint8Array(decryptedData);
  } catch (e) {
    console.error(e);
    throw new EncryptionError();
  }
};
