/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';
const imageTransform: any = require('@tryghost/image-transform');

let cardFactory: any;
let cards:any;
let mobiledocHtmlRenderer:any;

export default {
  get blankDocument() {
    return {
      version: '0.3.1',
      ghostVersion: '4.0',
      markups: [],
      atoms: [],
      cards: [],
      sections: [[1, 'p', [[0, [], 0, '']]]]
    };
  },

  get cards() {
    if (!cards) {
      const CardFactory = require('@tryghost/kg-card-factory');
      const defaultCards = require('@tryghost/kg-default-cards');

      cardFactory = new CardFactory({
        siteUrl: 'http://localhost:8080',
        // siteUrl: config.get("url"),
        imageOptimization: {
          resize: true,
          srcsets: true
        },
        // imageOptimization: config.get("imageOptimization"),
        canTransformImage(storagePath: string) {
          const { ext } = path.parse(storagePath);

          return (
            imageTransform.canTransformFiles() &&
            imageTransform.canTransformFileExtension(ext)
            // &&
            // typeof storage.getStorage().saveRaw === 'function'
          );
        }
      });

      cards = defaultCards.map((card: any) => cardFactory.createCard(card));
    }

    return cards;
  },

  get atoms() {
    return require('@tryghost/kg-default-atoms');
  },

  get mobiledocHtmlRenderer() {
    if (!mobiledocHtmlRenderer) {
      const MobiledocHtmlRenderer = require('@tryghost/kg-mobiledoc-html-renderer');

      mobiledocHtmlRenderer = new MobiledocHtmlRenderer({
        cards: this.cards,
        atoms: this.atoms,
        unknownCardHandler(args: any) {
          console.log('errror', args);
        }
      });
    }

    return mobiledocHtmlRenderer;
  },

  get htmlToMobiledocConverter() {
    try {
      return require('@tryghost/html-to-mobiledoc').toMobiledoc;
    } catch (err) {
      console.log(err);
      return () => {
        throw new Error('Unable to convert from source HTML to Mobiledoc');
      };
    }
  },

  // used when force-rerendering post content to ensure that old image card
  // payloads contain width/height values to be used when generating srcsets
  async populateImageSizes(mobiledocJson: any) {
    // do not require image-size until it's requested to avoid circular dependencies
    // shared/url-utils > server/lib/mobiledoc > server/lib/image/image-size > server/adapters/storage/utils
    const { imageSize } = require('./image');

    async function getUnsplashSize(url: string) {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.delete('w');
      parsedUrl.searchParams.delete('fit');
      parsedUrl.searchParams.delete('crop');
      parsedUrl.searchParams.delete('dpr');

      return await imageSize.getImageSizeFromUrl(parsedUrl.href);
    }

    const mobiledoc = JSON.parse(mobiledocJson);

    const sizePromises = mobiledoc.cards.map(async(card: any) => {
      const [cardName, payload] = card;

      const needsFilling =
        cardName === 'image' &&
        payload &&
        payload.src &&
        (!payload.width || !payload.height);
      if (!needsFilling) {
        return;
      }

      const isUnsplash = payload.src.match(/images\.unsplash\.com/);
      try {
        const size = isUnsplash
          ? await getUnsplashSize(payload.src)
          : await imageSize.getOriginalImageSizeFromStorageUrl(payload.src);

        if (size && size.width && size.height) {
          payload.width = size.width;
          payload.height = size.height;
        }
      } catch (e) {
        // TODO: use debug instead?
        // logging.error(e);
        console.log(e);
      }
    });

    await Promise.all(sizePromises);

    return JSON.stringify(mobiledoc);
  },

  // allow config changes to be picked up - useful in tests
  reload() {
    cardFactory = null;
    cards = null;
    mobiledocHtmlRenderer = null;
  }
};
