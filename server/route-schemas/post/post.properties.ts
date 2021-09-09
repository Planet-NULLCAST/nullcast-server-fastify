export const queryStringProps = {
  limit_fields: {
    type: 'string'
  },
  search: {
    type: 'string'
  },
  page: {
    type: 'string'
  },
  limit: {
    type: 'string'
  },
  status: {
    type: 'string'
  },
  order: {
    type: 'string'
  },
  sort_field: {
    type: 'string'
  },
  with_table: {
    type: 'string'
  }
};

export const mobiledoc = {
  type: 'object',
  description: 'user provided mobiledoc',
  properties: {
    atoms: {
      type: 'array'
    },
    markups: {
      type: 'array'
    },
    cards: {
      type: 'array'
    },
    sections: {
      type: 'array'
    },
    version: {
      type: 'string'
    },
    ghostVersion: {
      type: 'string'
    }
  }
};

export const postProps = {
  slug: {
    type: 'string',
    description: 'user should provide slug'
  },
  type: {
    type: 'string',
    description: 'user should provide type'
  },
  html: {
    type: 'string',
    description: 'user should provide html'
  },
  og_description: {
    type: 'string',
    description: 'user should provide og_description'
  },
  og_title: {
    type: 'string',
    description: 'user should provide og_title'
  },
  og_image: {
    type: 'string',
    description: 'user should provide og_image'
  },
  meta_description: {
    type: 'string',
    description: 'user should provide meta_description'
  },
  meta_title: {
    type: 'string',
    description: 'user should provide meta_title'
  },
  banner_image: {
    type: 'string',
    description: 'user should provide banner_image'
  },
  preview_url: {
    type: 'string',
    description: 'user should provide preview_url'
  },
  canonical_url: {
    type: 'string',
    description: 'user should provide canonical_url'
  },
  featured: {
    type: 'string',
    description: 'user should provide featured'
  },
  visibility: {
    type: 'string',
    description: 'user should provide visibility'
  },
  status: {
    type: 'string',
    description: 'user should provide status'
  },
  title: {
    type: 'string',
    description: 'user should provide title'
  },
  mobiledoc
};
