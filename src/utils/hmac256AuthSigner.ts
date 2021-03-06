require('source-map-support').install();

import crypto = require('crypto');

export type HMACSigner = (method: string, path: string, contentType: string, body?: string|null) => string;
export type HMACSignerFactory = (service: string, token: string, secret: string) => HMACSigner;

export const CreateHMACSigner: HMACSignerFactory = (service: string, token: string, secret: string): HMACSigner => {
  if (!service) throw Error('Hmac256AuthSigner config requires a service');
  if (!token) throw Error('Hmac256AuthSigner config requires a token');
  if (!secret) throw Error('Hmac256AuthSigner config requires a secret');

  return (method, path, contentType, body) => {
    const ts = Math.floor(new Date().getTime() / 1000);
    const bodyPart = body ? crypto.createHash('md5').update(body).digest('hex') : '';
    const message = `${method}\n${path}\n${(body ? contentType : '')}\n${ts}\n${bodyPart}`;
    const signature = crypto.createHmac('sha256', secret).update(message).digest('hex');
    return `${service} ts=${ts} token=${token} signature=${signature}`;
  };
};
