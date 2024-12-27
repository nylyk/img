declare module "common" {
  namespace Api {
    export interface Limits {
      sizeBytes: number;
      expireTimes: number[];
      defaultExpireTime: number;
    }

    export interface FooterLink {
      title: string;
      url: string;
    }
    export interface Footer {
      text: string;
      links: FooterLink[];
    }

    export interface Post {
      id: string;
      expiresAt: number;
      data: string;
    }
    export interface PostUpload {
      id: string;
      expiresAt: number;
      secret: string;
    }
    export interface PostInfo {
      id: string;
      expiresAt: number;
    }
  }
}
