declare module "common" {
  namespace api {
    export interface PostMetadata {
      maxSizeBytes: number;
      expireTimesSeconds: number[];
      defaultExpireTimeSeconds: number;
    }
    export interface CreatePost {
      id: string;
      expiresAt: string;
      secret: string;
    }
    export interface Post {
      id: string;
      expiresAt: string;
      data: string;
    }

    export interface FooterLink {
      title: string;
      url: string;
    }
    export interface Footer {
      text: string;
      links: FooterLink[];
    }
  }
}
