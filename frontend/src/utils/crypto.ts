import { base64URLdecode, base64URLencode } from './base64';

const deriveKey = async (
  data: Uint8Array,
  iterationFactor: number
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
    ['encrypt', 'decrypt']
  );
};

export const encrypt = async (
  data: Uint8Array
): Promise<[string, string, number]> => {
  const keyData = crypto.getRandomValues(new Uint8Array(16));
  const iterationFactor = 4;
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
    data
  );

  // combine iv and cipher text
  const cipherArray = new Uint8Array(iv.byteLength + encryptedData.byteLength);
  cipherArray.set(iv, 0);
  cipherArray.set(new Uint8Array(encryptedData), iv.byteLength);
  const cipherText = base64URLencode(cipherArray);

  return [password, cipherText, cipherArray.byteLength];
};

export const decrypt = async (
  base64: string,
  password: string
): Promise<Uint8Array> => {
  const passwordData = base64URLdecode(password);
  const iterationFactor = new DataView(passwordData.buffer).getUint8(0);
  const keyData = passwordData.slice(1);
  const key = await deriveKey(keyData, iterationFactor);

  const postData = base64URLdecode(base64);
  const iv = postData.slice(0, 12);
  const encryptedData = postData.slice(12);

  const data = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encryptedData
  );

  return new Uint8Array(data);
};
