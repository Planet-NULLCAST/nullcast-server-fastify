import got, { Got, Options } from 'got';
import { promises as dnsPromises } from 'dns';
import validator from 'validator';

const appURL: string = process.env.FRONT_END_URL || 'http://localhost:3000';

function isPrivateIp(addr: string) {
  return (
    /^(::f{4}:)?10\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) ||
    /^(::f{4}:)?192\.168\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) ||
    /^(::f{4}:)?172\.(1[6-9]|2\d|30|31)\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(
      addr
    ) ||
    /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) ||
    /^(::f{4}:)?169\.254\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) ||
    /^f[cd][0-9a-f]{2}:/i.test(addr) ||
    /^fe80:/i.test(addr) ||
    /^::1$/.test(addr) ||
    /^::$/.test(addr)
  );
}

async function errorIfHostnameResolvesToPrivateIp(options: Options) {
  // allow requests through to local Ghost instance
  const siteUrl = new URL(appURL);
  const requestUrl = new URL(options.href as string);
  if (requestUrl.host === siteUrl.host) {
    return Promise.resolve();
  }

  const result = await dnsPromises.lookup(options.hostname as string);

  if (isPrivateIp(result.address)) {
    return Promise.reject(
      new Error('URL resolves to a non-permitted private IP block')
    );
  }
}

// same as our normal request lib but if any request in a redirect chain resolves
// to a private IP address it will be blocked before the request is made.
const externalRequest: Got = got.extend({
  headers: {
    'user-agent': 'Ghost(https://github.com/TryGhost/Ghost)'
  },
  hooks: {
    init: [
      (options) => {
        if (!options.hostname || !validator.isURL(options.hostname)) {
          throw new Error('URL empty or invalid.');
        }
      }
    ],
    beforeRequest: [errorIfHostnameResolvesToPrivateIp],
    beforeRedirect: [errorIfHostnameResolvesToPrivateIp]
  }
});

export default externalRequest;
