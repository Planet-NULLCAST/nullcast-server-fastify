import { Client, QueryConfig } from 'pg';
import { Activity } from '../../server/interfaces/activities.type';
import * as tableNames from '../../server/constants/tables';
import { Post } from 'interfaces/post.type';
import { findActivityType } from '../../server/utils/activities.utils';
import { bulkWrite } from '../../server/services/postgres/query-builder.service';


export async function addActivityPoints() {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;
    const getUserActivitiesQuery: QueryConfig = {
      text: `SELECT id, user_id, class_id,
              activity_type_id, post_id, event_id
              FROM ${tableNames.ACTIVITY_TABLE};`
    };
    const data = await postgresClient.query(getUserActivitiesQuery);

    const Activity = data.rows as Activity[];
    const post = Activity.filter((item) => item.post_id).map((item) => item.post_id).join(',');

    const FindUnrewardedPostsQuery: QueryConfig = {
      text: `SELECT id, created_by
              FROM ${tableNames.POST_TABLE}
              WHERE status = 'published' ${post && `AND id NOT IN(${post})`} ;`
    };
    const postData = await postgresClient.query(FindUnrewardedPostsQuery);
    const posts = postData.rows as Post[];
    const activityData: Activity[] = [];
    const activity = await findActivityType('published_post') as Activity;
    if(posts[0]) {
      posts.forEach((post: Post) => {
        // activity data
        delete Object.assign(post, {['post_id']: post['id'] })['id'];
        delete Object.assign(post, {['user_id']: post['created_by'] })['created_by'];
        activityData.push({...activity, ...post});
      })
      await bulkWrite(tableNames.ACTIVITY_TABLE, activityData);
      console.log('Activity points added for published posts')
    } else {
      console.log('Points are already added for all published posts')
    }
  } catch(error) {
    throw error;
  }
}
