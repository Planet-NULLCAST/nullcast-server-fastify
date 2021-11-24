import initServices from '../../server/initialize-services';
import {
  findOneByField,
  insertOne,
  bulkWrite
} from '../../server/services/postgres/query-builder.service';
import * as tableNames from '../../server/constants/tables';
import mongoose from 'mongoose';
import * as db from './models';

import {
  Client, QueryConfig, QueryResultRow
} from 'pg';
import { migrateRoles } from './migrate-roles';
import { replaceImageUrlPost } from './replace-image-url-post';


// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

interface PgUser {
  id: string;
  email: string;
}

interface UserMap {
  [x: string]: PgUser;
}

interface RandomObj {
  [x: string]: any;
}

interface MongoVote {
  votedAt: Date;
  userId: string;
  type: string;
}

async function migrateData() {
  try {
    // Connect to both mongo and postgres databases
    await connectToMongo();
    await initServices();

    // All create operations are done on postgres database
    // Create a default user to assign created_by field for tags table
    // Valid tables are posts, skills, tags, users, subscribers, enrols
    const defaultUser = await createUser();
    await migrateSkillsandTags(defaultUser.id);

    const { users, userSkills } = await migrateUsers();
    await migrateSubscribers();

    // Migrate subscriber
    await migrateUserTags(users, userSkills);

    const userMap: UserMap = await createMongoUserMap(users);

    await migratePostAndRelated(userMap);

    //Change the Url structure inside mobiledoc to neede structure
    const oldUrl = 'https://nullcast.io/';
    const replaceUrl = `https://s3.amazonaws.com/${server(process.env.ENV as string)}/old/`;
    await replaceImageUrlPost(oldUrl, replaceUrl);

    //Migrate roles and user-roles
    await migrateRoles();

    process.exit();
  } catch (error) {
    console.log(error);
    // throw error;
    process.exit();
  }
}
migrateData();

//Function to determine the server from env
const server = (env: string) => {
  if (env == 'development') {
    return 'dev';
  } else if (env == 'production') {
    return 'prod';
  } else {
    return env;
  }
}

async function connectToMongo() {
  const DB_HOST = 'localhost';
  const DB_PORT = '8000';
  const DB_NAME = 'nullcast';
  const MONGOURL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

  try {
    return await mongoose.connect(MONGOURL);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function migrateSkillsandTags(created_by: number) {
  const skills = await db.skill.find();
  const tags = await db.tag.find();

  // remove duplicates and merge skills and tags into a single array

  const mergedTags = skills.map((skill: { name: string }) => ({
    name: skill.name.toLowerCase().replace(/ /g, '-'),
    meta_title: skill.name.toLowerCase().replace(/ /g, '-'),
    slug: skill.name.toLowerCase().replace(/ /g, '-'),
    created_by
  }));

  tags.forEach(
    (tag: { name: string; created_at: string; updated_at: string }) => {
      const formattedTagName = tag.name.toLowerCase().replace(/ /g, '-');
      const foundSkill = skills.find(
        (skill: { name: string }) =>
          skill.name.toLowerCase().replace(/ /g, '-') === formattedTagName
      );

      if (!foundSkill) {
        const foundTag = mergedTags.find(
          (tag: { name: string }) =>
            tag.name.toLowerCase().replace(/ /g, '-') === formattedTagName
        );
        if (!foundTag) {
          const newTag = {
            name: formattedTagName,
            meta_title: formattedTagName,
            slug: formattedTagName,
            created_by,
            created_at: tag.created_at,
            updated_at: tag.updated_at
          };

          mergedTags.push(newTag);
        }
      }
    }
  );

  console.log(mergedTags);

  // Insert the new tags to postgres
  const response = await bulkWrite(tableNames.TAG_TABLE, mergedTags);
  console.log('migrated all the tags');
  return response;
}

async function createUser() {
  const ENTITY_NAME = 'nullcast';
  const BADGE_NAME = 'noob';

  const entity = await findOneByField(
    tableNames.ENTITY_TABLE,
    { name: ENTITY_NAME },
    ['id']
  );
  const badge = await findOneByField(
    tableNames.BADGE_TABLE,
    { name: BADGE_NAME },
    ['id']
  );

  const user = {
    entity_id: entity.id,
    user_name: 'nullcast',
    full_name: 'default',
    email: 'nullcast@testmail.com',
    slug: 'nullcast',
    password: 'testUser@123',
    cover_image:
      'https://steamuserimages-a.akamaihd.net/ugc/187297348924941474/E14283CF3768FD1F0CAFC36C27BF2F41164B697F/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false',
    avatar:
      'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/fe/feb60c75706d9ed2533669dd58205eca4201d775_full.jpg',
    bio: 'This is nullcast user bio',
    meta_title: 'Meta title for nullcast user',
    meta_description: 'Meta description for nullcast user',
    locale: 'en-IN',
    primary_badge: badge.id
  };

  const createdUser = await insertOne(tableNames.USER_TABLE, user, ['id']);
  console.log('created a new default user');
  return createdUser.rows[0];
}

async function migrateUsers() {
  // get all the users
  const users = await db.user.find().lean();

  const ENTITY_NAME = 'nullcast';
  const BADGE_NAME = 'noob';

  const entity = await findOneByField(
    tableNames.ENTITY_TABLE,
    { name: ENTITY_NAME },
    ['id']
  );
  const badge = await findOneByField(
    tableNames.BADGE_TABLE,
    { name: BADGE_NAME },
    ['id']
  );

  const userSkills: RandomObj = {};

  const newUsers = users.map((user: RandomObj) => {
    if (user.skills.length) {
      userSkills[user.email] = user.skills;
    }
    const obj = {
      entity_id: entity.id,
      primary_badge: badge.id,
      full_name: user.fullName,
      bio: user.bio,
      avatar: user.avatar,
      twitter: user.twitter,
      facebook: user.facebook,
      discord: user.discord,
      github: user.github,
      website: user.website,
      user_name: user.username,
      slug: user.username,
      meta_title: user.username,
      meta_description: user.bio,
      email: user.email,
      password: user.password,
      created_at: user.createdAt,
      updated_at: user.updatedAt
    };

    return obj;
  });

  const createdUsers = await bulkWrite(tableNames.USER_TABLE, newUsers, [
    'id',
    'email'
  ]);
  console.log('migrated users');
  return { users: createdUsers.rows, userSkills };
}

async function migrateUserTags(users: PgUser[], userSkills: RandomObj) {
  const userTags: any[] = [];
  const tags = await findAll(tableNames.TAG_TABLE, ['id', 'name']);

  users.forEach((user) => {
    if (userSkills[user.email]) {
      userSkills[user.email].forEach((userskill: string) => {
        const tag = tags.find(
          (tag: { name: string; id: number }) =>
            tag.name === userskill.toLowerCase().replace(/ /g, '-')
        );

        const userTag = {
          user_id: user.id,
          tag_id: tag.id,
          created_by: user.id // a user tag is created by the same user
        };
        userTags.push(userTag);
      });
    }
  });

  const response = await bulkWrite(tableNames.USER_TAG_TABLE, userTags);
  console.log('migrated skills of users');
  return response;
}

async function migrateSubscribers() {
  const mongoSubscribers = await db.subscriber.find().lean();
  const subscribers: any[] = mongoSubscribers.map((sub: any) => ({
    email: sub.email
  }));
  console.log('migrated subscribers');
  return await bulkWrite(tableNames.SUBSCRIBER_TABLE, subscribers);
}

async function migratePostAndRelated(userMap: UserMap) {
  const mongoPosts = await db.post.find().lean();

  const tags = await findAll(tableNames.TAG_TABLE, ['id', 'name']);

  for await (const mongoPost of mongoPosts) {
    // The last updated user is either the last contributor or the primary author
    const updatedBy: string =
      mongoPost.contributors.pop() || mongoPost.createdBy;

    const post = {
      mobiledoc: mongoPost.mobiledoc,
      title: mongoPost.title,
      status: mongoPost.status,
      featured: mongoPost.featured,
      canonical_url: (mongoPost.canonicalUrl as string).split('/').pop(),
      preview_url: mongoPost.url,
      banner_image: mongoPost.bannerImage,
      meta_title: mongoPost.metaTitle,
      meta_description: mongoPost.metaDescription,
      og_image: mongoPost.bannerImage,
      og_title: mongoPost.metaTitle,
      og_description: mongoPost.metaDescription,
      html: mongoPost.html,
      slug: mongoPost.slug || null,
      created_at: mongoPost.createdAt,
      updated_at: mongoPost.updatedAt,
      published_at: mongoPost.publishedAt,
      created_by: userMap[mongoPost.createdBy as string]?.id,
      updated_by: userMap[updatedBy]?.id
    };

    const createdPost = await insertOne(tableNames.POST_TABLE, post, [
      'id',
      'preview_url',
      'created_by'
    ]);

    if (mongoPost.votes.length) {
      const votes = mongoPost.votes.map((vote: MongoVote) => ({
        post_id: createdPost.rows[0].id,
        user_id: userMap[vote.userId]?.id,
        value: vote.type === 'down' ? -1 : 1,
        created_at: vote.votedAt,
        updated_at: vote.votedAt
      }));

      await bulkWrite(tableNames.POST_VOTE_TABLE, votes);
    }

    if (mongoPost.tags.length) {
      const pgTags = mongoPost.tags
        .map((mongoTag: string) => {
          const postTag = tags.find(
            (tag: { name: string; id: number }) =>
              tag.name === mongoTag.toLowerCase().replace(/ /g, '-')
          );
          if (postTag) {
            return {
              post_id: createdPost.rows[0].id,
              tag_id: postTag.id,
              created_at: mongoPost.createdAt,
              created_by: userMap[mongoPost.createdBy as string]?.id
            };
          }
          return undefined;
        })
        .filter((tag: any) => !!tag);

      if (pgTags.length) {
        await bulkWrite(tableNames.POST_TAG_TABLE, pgTags);
      }
    }
  }

  console.log('migrated posts, post_tags and votes');
  return 'migrated posts';
}

async function createMongoUserMap(pgUsers: PgUser[]) {
  const mongoUsers = await db.user.find().lean();
  const mongoMap: UserMap = {};

  pgUsers.forEach((pgUser) => {
    const userFound = mongoUsers.find(
      (mongoUser) => mongoUser.email === pgUser.email
    );
    if (userFound) {
      mongoMap[userFound._id] = pgUser;
    }
  });

  return mongoMap;
}

export async function findAll(
  tableName: string,
  attributes?: any[]
): Promise<QueryResultRow> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    // If no attributes are passed set the columns to *
    let columns = '*';

    // Construct columns for the prepared statement from the payload
    if (attributes && attributes.length) {
      columns = attributes.join(', ');
    }
    // Build the query text for prepared statement
    const text = `SELECT ${columns} FROM ${tableName}`;

    const query: QueryConfig = {
      text,
      values: []
    };

    return await (
      await postgresClient.query(query)
    ).rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
