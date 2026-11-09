import { base64URLdecode, base64URLencode } from './base64';
import { EncryptionError } from './errors';

export const encrypt = async (
  data: Uint8Array<ArrayBuffer>,
): Promise<[Uint8Array<ArrayBuffer>, string]> => {
  try {
    const keyData = crypto.getRandomValues(new Uint8Array(16));
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      'AES-GCM',
      false,
      ['encrypt'],
    );
    const password = base64URLencode(keyData);

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
  data: Uint8Array<ArrayBuffer>,
  password: string,
): Promise<Uint8Array<ArrayBuffer>> => {
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      base64URLdecode(password),
      'AES-GCM',
      false,
      ['decrypt'],
    );

    const iv = data.subarray(0, 12);
    const encryptedData = data.subarray(12);

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
