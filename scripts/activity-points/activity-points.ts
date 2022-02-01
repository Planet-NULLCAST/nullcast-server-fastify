import { Client, QueryConfig } from 'pg';
import { Activity } from '../../server/interfaces/activities.type';
import * as tableNames from '../../server/constants/tables';
import { Post } from 'interfaces/post.type';
import { findActivityType } from '../../server/utils/activities.utils';
import { bulkWrite } from '../../server/services/postgres/query-builder.service';


export async function addActivityPoints() {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;
    // Query to get already rewarded activities
    const getUserActivitiesQuery: QueryConfig = {
      text: `SELECT id, user_id, class_id,
              activity_type_id, post_id, event_id
              FROM ${tableNames.ACTIVITY_TABLE};`
    };

    const rewardedActivities = (await postgresClient.query(getUserActivitiesQuery)).rows as Activity[];

    // Group of post ids which are already rewarded
    const rewardedPosts = rewardedActivities.filter((item) => item.post_id).map((item) => item.post_id).join(',');

    // Query to find posts which are not rewarded
    const FindUnrewardedPostsQuery: QueryConfig = {
      text: `SELECT id, created_by
              FROM ${tableNames.POST_TABLE}
              WHERE status = 'published' ${rewardedPosts && `AND id NOT IN(${rewardedPosts})`} ;`
    };

    const unrewardedPosts = (await postgresClient.query(FindUnrewardedPostsQuery)).rows as Post[];

    // Function to get activity details according to the activity type
    const activity = await findActivityType('published_post') as Activity;

    // Array in which unrewarded posts with the related activity details are added
    const activityData: Activity[] = [];

    // Condition to check whether to add activity points if not all posts are rewarded
    if (unrewardedPosts.length) {
      unrewardedPosts.forEach((post: Post) => {
        delete Object.assign(post, {['post_id']: post['id'] })['id'];
        delete Object.assign(post, {['user_id']: post['created_by'] })['created_by'];
        activityData.push({...activity, ...post});
      });

      // Activity points are now added to unrewarded published posts
      await bulkWrite(tableNames.ACTIVITY_TABLE, activityData);
      console.log('Activity points added for published posts');
    } else {
      console.log('Points are already added for all published posts');
    }
  } catch (error) {
    throw error;
  }
}
