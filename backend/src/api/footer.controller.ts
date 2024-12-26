import { Api } from 'common';
import { Handler } from 'express';
import { footerText } from '../utils/env.js';

const titleKeys = Object.keys(process.env).filter((key) =>
  key.startsWith('FOOTER_LINK_TITLE_')
);
const urlKeys = Object.keys(process.env).filter((key) =>
  key.startsWith('FOOTER_LINK_URL_')
);

console.log(titleKeys);
console.log(urlKeys);

const footerLinks: Api.FooterLink[] = [];
titleKeys.forEach((titleKey) => {
  const titleKeyName = titleKey.split('_').slice(3).join('_');
  const urlKey = urlKeys.find((urlKey) => {
    const urlKeyName = urlKey.split('_').slice(3).join('_');
    return titleKeyName === urlKeyName;
  });
  if (urlKey) {
    footerLinks.push({
      title: process.env[titleKey]!,
      url: process.env[urlKey]!,
    });
  }
});

export const get: Handler = (_req, res, _next) => {
  const response: Api.Footer = {
    text: footerText,
    links: footerLinks,
  };

  res.json(response);
};
