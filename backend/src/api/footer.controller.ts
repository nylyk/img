import express from 'express';
import { Api } from 'common';
import { footerText } from '../utils/env.js';

const titleKeys = Object.keys(process.env).filter((key) =>
  key.startsWith('FOOTER_LINK_TITLE_')
);
const urlKeys = Object.keys(process.env).filter((key) =>
  key.startsWith('FOOTER_LINK_URL_')
);

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

const router = express.Router();

router.get('/', (_req, res, _next) => {
  const response: Api.Footer = {
    text: footerText,
    links: footerLinks,
  };

  res.json(response);
});

export default router;
