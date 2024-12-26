declare module "common" {
  namespace Api {
    export interface Limits {
      items: number;
      bytes: number;
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
  }
}
