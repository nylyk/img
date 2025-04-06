export interface Image {
  dataUrl: string;
  description: string;
}

export interface Post {
  title: string;
  images: Image[];
}
