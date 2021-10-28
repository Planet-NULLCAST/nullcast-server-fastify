export function queryStringProps(routeName: string) {

  const key = routeName;
  const queryParams: any = {
    search: {
      type: 'string',
      default: '',
      description: 'Search keywords'
    },
    page: {
      type: 'number',
      default: 1,
      description: 'Page number'
    },
    limit: {
      type: 'number',
      default: 10,
      description: 'Number of datas to be fetched'
    },
    order: {
      type: 'string',
      default: 'ASC',
      description: 'The order in which the data would be arranged'
    },
    sort_field: {
      type: 'string',
      default: key == 'post' || key == 'events' ? 'published_at' : 'created_at',
      description: 'The field name according to which data would be arranged'
    }
  };
  if (key != 'events' && key != 'user_tags') {
    queryParams.with_table = {
      type: 'array',
      default: key == 'post' ? ['users', 'tags'] : ['entity', 'primary_badge'],
      description: 'The tables which should be included'
    };
  }
  if (key != 'user_tags') {
    queryParams.status = {
      type: 'string',
      default: key == 'post' ? '': key == 'events' ? 'published' : 'active',
      description: `Status of the ${key} data`
    }
  }
  return queryParams;
}
