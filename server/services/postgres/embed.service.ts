import externalRequest from '../../lib/request-external';
import { extract, hasProvider } from 'oembed-parser';
import cheerio from 'cheerio';
import _ from 'lodash';

const appURL: string = process.env.FRONT_END_URL || 'http://localhost:3000';

const findUrlWithProvider = (url: string) => {
  let provider;

  // build up a list of URL variations to test against because the oembed
  // providers list is not always up to date with scheme or www vs non-www
  const baseUrl = url.replace(/^\/\/|^https?:\/\/(?:www\.)?/, '');
  const testUrls = [
    `http://${baseUrl}`,
    `https://${baseUrl}`,
    `http://www.${baseUrl}`,
    `https://www.${baseUrl}`
  ];

  for (const testUrl of testUrls) {
    provider = hasProvider(testUrl);
    if (provider) {
      url = testUrl;
      break;
    }
  }

  return { url, provider };
};

const oembed = {
  noUrlProvided: 'No url provided.',
  insufficientMetadata: 'URL contains insufficient metadata.',
  unknownProvider: 'No provider found for supplied URL.'
};

export function unknownProvider() {
  return Promise.reject(new Error(oembed.unknownProvider));
}

export function knownProvider(url: string) {
  return extract(url, { maxwidth: 1280 }).catch((err) =>
    Promise.reject(new Error(err.message))
  );
}

function isIpOrLocalhost(url: string) {
  try {
    const IPV4_REGEX =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const IPV6_REGEX = /:/; // fqdns will not have colons
    const HTTP_REGEX = /^https?:/i;

    const siteUrl = new URL(appURL);
    const { protocol, hostname, host } = new URL(url);

    console.log(new URL(url));

    // allow requests to Ghost's own url through
    if (siteUrl.host === host) {
      return false;
    }

    if (
      !HTTP_REGEX.test(protocol) ||
      hostname === 'localhost' ||
      IPV4_REGEX.test(hostname) ||
      IPV6_REGEX.test(hostname)
    ) {
      console.log('url ==>', url);
      return true;
    }

    return false;
  } catch (e) {
    return true;
  }
}

export function fetchOembedData(_url: string) {
  // parse the url then validate the protocol and host to make sure it's
  // http(s) and not an IP address or localhost to avoid potential access to
  // internal network endpoints
  console.log('url inside fetch oembed data', _url);
  if (isIpOrLocalhost(_url)) {
    return unknownProvider();
  }

  // check against known oembed list
  let { url, provider } = findUrlWithProvider(_url);
  if (provider) {
    return knownProvider(url);
  }

  // url not in oembed list so fetch it in case it's a redirect or has a
  // <link rel="alternate" type="application/json+oembed"> element
  return externalRequest(url, {
    method: 'GET',
    timeout: 2 * 1000,
    followRedirect: true
  }).then((pageResponse) => {
    // url changed after fetch, see if we were redirected to a known oembed
    if (pageResponse.url !== url) {
      ({ url, provider } = findUrlWithProvider(pageResponse.url));
      if (provider) {
        return knownProvider(url);
      }
    }

    // check for <link rel="alternate" type="application/json+oembed"> element
    let oembedUrl;
    try {
      oembedUrl = cheerio(
        'link[type="application/json+oembed"]',
        pageResponse.body
      ).attr('href');
    } catch (e) {
      return unknownProvider();
    }

    if (oembedUrl) {
      // make sure the linked url is not an ip address or localhost
      if (isIpOrLocalhost(oembedUrl)) {
        return unknownProvider();
      }

      // fetch oembed response from embedded rel="alternate" url
      return externalRequest(oembedUrl, {
        method: 'GET',
        json: [true],
        timeout: 2 * 1000,
        followRedirect: true
      })
        .then((oembedResponse) => {
          // validate the fetched json against the oembed spec to avoid
          // leaking non-oembed responses
          const body = JSON.parse(oembedResponse.body);
          const hasRequiredFields = body.type && body.version;
          const hasValidType = ['photo', 'video', 'link', 'rich'].includes(
            body.type
          );

          if (hasRequiredFields && hasValidType) {
            // extract known oembed fields from the response to limit leaking of unrecognised data
            const knownFields = [
              'type',
              'version',
              'html',
              'url',
              'title',
              'width',
              'height',
              'author_name',
              'author_url',
              'provider_name',
              'provider_url',
              'thumbnail_url',
              'thumbnail_width',
              'thumbnail_height'
            ];
            const oembed = _.pick(body, knownFields);

            // ensure we have required data for certain types
            if (oembed.type === 'photo' && !oembed.url) {
              return false;
            }
            if (
              (oembed.type === 'video' || oembed.type === 'rich') &&
              (!oembed.html || !oembed.width || !oembed.height)
            ) {
              return false;
            }

            // return the extracted object, don't pass through the response body
            return oembed;
          }
          return false;
        })
        .catch((err) => console.log(err));
    }
    return false;
  });
}
