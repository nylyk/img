export interface Image {
  dataUrl: string;
  description: string;
}

export interface Post {
  title: string;
  images: Image[];
}

// Actual serialization code will take this place sometime soon
export const serializePost = (post: Post): Uint8Array => {
  return new TextEncoder().encode(JSON.stringify(post));
};

export const deserializePost = (data: Uint8Array): Post => {
  return JSON.parse(new TextDecoder().decode(data));
};
