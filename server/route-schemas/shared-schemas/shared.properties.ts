export function queryStringProps(routeName: string) {

  const key = routeName;
  return ({
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
    status: {
      type: 'string',
      default: key == 'post' ? 'published' : 'active',
      description: `Status of the ${key} data`
    },
    order: {
      type: 'string',
      default: 'ASC',
      description: 'The order in which the data would be arranged'
    },
    sort_field: {
      type: 'string',
      default: key == 'post' ? 'published_at' : 'created_at',
      description: 'The field name according to which data would be arranged'
    },
    with_table: {
      type: 'array',
      default: key == 'post' ? ['users', 'tags'] : ['entity', 'primary_badge'],
      description: 'The tables which should be included'
    }
  });
}
