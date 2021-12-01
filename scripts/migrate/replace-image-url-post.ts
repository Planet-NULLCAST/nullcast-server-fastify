import { Client, QueryConfig } from 'pg';
import { default as mobiledocLib} from '../../server/lib/mobiledoc';
import { mobiledoc, Post } from 'interfaces/post.type';
import * as tableNames from '../../server/constants/tables';
import { isArray } from 'lodash';
import { updateOneById } from '../../server/services/postgres/query-builder.service';


export async function replaceImageUrlPost(oldUrl: string, replaceUrl: string) {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;
  const convertToHTML = (mobiledoc: mobiledoc) => mobiledocLib.mobiledocHtmlRenderer.render(mobiledoc);

  const getPostsQuery: QueryConfig = {
    text: `SELECT id, mobiledoc
            from ${tableNames.POST_TABLE};`
  };
  const data = await postgresClient.query(getPostsQuery);
  const posts = data.rows as Post[];

  posts.forEach(async(post: Post) => {
    let mobiledoc = post.mobiledoc;

    function changeUrl(element: any) {
      if (isArray(element)) {
        element.forEach((elementChild, index) => {
          if ((typeof (elementChild) === 'string') && elementChild.toLowerCase().includes(oldUrl)) {
            element[index] = elementChild.replace(oldUrl, replaceUrl);
          } else {
            changeUrl(elementChild);
          }
        });
      } else if (element instanceof Object) {
        for (const [key, value] of Object.entries(element)) {
          if ((typeof (value) === 'string') && value.toLowerCase().includes(oldUrl)) {
            element[key] = value.replace(oldUrl, replaceUrl);
          } else {
            changeUrl(value);
          }
        }
      }
      return element;
    }
    mobiledoc = changeUrl(mobiledoc);
    const html: string = convertToHTML(mobiledoc as mobiledoc);
    const payload = {
      html,
      mobiledoc
    };
    const data = await updateOneById(tableNames.POST_TABLE, post.id as number, payload);
    return data.rows[0] as Post;
  });
  console.log("Image Url replaced")
  return 'Updated url of the posts';
}
