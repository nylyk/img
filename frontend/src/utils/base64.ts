const base64URLencodeSlow = (data: Uint8Array): string => {
  let binary = '';
  const chunkSize = 0x8000; // 32KB chunks
  for (let i = 0; i < data.length; i += chunkSize) {
    binary += String.fromCharCode.apply(
      null,
      data.subarray(i, i + chunkSize) as unknown as number[]
    );
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const base64URLdecodeSlow = (base64url: string): Uint8Array => {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const uint8 = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    uint8[i] = binary.charCodeAt(i);
  }
  return uint8;
};

export const base64URLencode = (data: Uint8Array): string => {
  if ('toBase64' in data && typeof data.toBase64 === 'function') {
    return data.toBase64({ alphabet: 'base64url', omitPadding: true });
  }
  console.warn('Using slow base64 encoding');
  return base64URLencodeSlow(data);
};

export const base64URLdecode = (base64url: string): Uint8Array => {
  if (
    'fromBase64' in Uint8Array &&
    typeof Uint8Array.fromBase64 === 'function'
  ) {
    return Uint8Array.fromBase64(base64url, { alphabet: 'base64url' });
  }
  console.warn('Using slow base64 decoding');
  return base64URLdecodeSlow(base64url);
};
