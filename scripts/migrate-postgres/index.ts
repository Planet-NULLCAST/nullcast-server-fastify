import { Client, QueryConfig } from "pg";
import { isArray } from "lodash";
import { default as mobiledocLib} from '../../server/lib/mobiledoc';
import { mobiledoc, Post } from "interfaces/post.type";
import * as tableNames from '../../server/constants/tables';
import initServices from "initialize-services";
import { insertMany, updateOneById 
} from "../../server/services/postgres/query-builder.service";


async function migrateData() {

  await initServices();
  await migrateMobiledocToPost();
  await migrateRoles();
}

migrateData();


const postgresClient: Client = (globalThis as any).postgresClient as Client;

async function migrateMobiledocToPost() {
  const convertToHTML = (mobiledoc: mobiledoc) => mobiledocLib.mobiledocHtmlRenderer.render(mobiledoc);

  const getPostsQuery: QueryConfig = {
    text: `SELECT id, mobiledoc
            from ${tableNames.POST_TABLE};`
  };
  const data = await postgresClient.query(getPostsQuery);
  const posts = data.rows as Post[];
  
  const oldUrl = "https://nullcast.io/";
  const replaceUrl = "https://s3.amazonaws.com/dev/old/";

  posts.map(async (post: Post) => {
    var mobiledoc = post.mobiledoc

    function changeUrl(element: any) {
      if (isArray(element)) {
        element.map((elementChild, index) => {
          if ((typeof(elementChild) === 'string') && elementChild.toLowerCase().includes(oldUrl)) {
            element[index] = elementChild.replace(oldUrl, replaceUrl);
          } else {
            changeUrl(elementChild);
          }
        })
      } else if (element instanceof Object) {
        for (const [key, value] of Object.entries(element)) {
          if ((typeof(value) === 'string') && value.toLowerCase().includes(oldUrl)) {
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
      html: html,
      mobiledoc: mobiledoc
    }
    const data = await updateOneById(tableNames.POST_TABLE, post.id as number, payload);
    return data.rows[0] as Post;
  })
  return 'Migrated Posts'
}

async function migrateRoles() {

  const getUserQuery: QueryConfig = {
    text: `SELECT id, user_name 
            FROM ${tableNames.USER_TABLE}
            WHERE user_name = 'nullcast';`
  }
  const userData = await postgresClient.query(getUserQuery);

  const payload = [
    {
      name: 'admin',
      description: 'Admin access'
    },
    {
      name: 'user',
      description: 'User access'
    }
  ]
  const uniqueField = 'name';
  if (userData.rows[0].id) {
    const userId = userData.rows[0].id as number;
    payload.map((item: any) => {
      item.created_by = userId;
    })
  }
  await insertMany(tableNames.ROLE_TABLE, payload, [], uniqueField, false);

  migrateUserRoles(userData.rows[0].id);

  return 'Roles migrated';
}

async function migrateUserRoles(userId: number) {
  const getRoleQuery: QueryConfig = {
    text: `SELECT id 
            FROM ${tableNames.ROLE_TABLE}
            WHERE name = 'user';`
  }
  const data = await postgresClient.query(getRoleQuery);

  const roleId = data.rows[0].id as number;
  let keys = `ur.user_id, ur.role_id`
  let values = `u.id, ${roleId}`;

  if (userId) {
    keys = `${keys}, ur.created_by`
    values = `${values}, ${userId}`
  }

  const AddUserRoleQuery: QueryConfig = {
    text: `INSERT INTO 
            ${tableNames.USER_ROLE_TABLE} AS ur
            (${keys})
            SELECT ${values} FROM ${tableNames.USER_TABLE} AS u
            WHERE ur.name = 'user';`
  }
  await postgresClient.query(AddUserRoleQuery);
  console.log('User roles migrated')
}



