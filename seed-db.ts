import initServices from './server/initialize-services';
import { insertMany, insertOne } from './server/services/postgres/query-builder.service';
import * as tableNames from './server/constants/tables';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

let globalUserId = 10000000;
let created_by = 10000000;

// tableNames.
const entity = {
  name: 'nullcast1',
  description: 'For the community by the community'
};

const tags = [
  {
    name: 'first_tag',
    meta_title: 'first_tag',
    description: 'this is the first tag',
    feature_image: 'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/379720/fdc13a096879b8c722f6759b4524bcb707b6ca8c.png',
    slug: 'first_tag',
    created_by: 10000000
  },
  {
    name: 'second_tag',
    meta_title: 'second_tag',
    description: 'this is the second tag',
    meta_description: 'Meta description for second tag',
    slug: 'second_tag',
    visibility: 'private',
    created_by: 10000000
  }
];

const badges: Array<{ [x: string]: any }> = [
  {
    name: 'Badge 1',
    description: 'This is the badge 1 description',
    avatar: 'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/876740/00d30faeec0f40ef00de52f47d2c0ea5d628ef00.png'
  },
  {
    name: 'Badge 2',
    description: 'This is the badge 2 description',
    avatar: 'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/1343890/03d07e6fd185d9773b8ff2602cb6c5c051c063e7.png'
  }
];

const users = [
  {
    entity_id: 10000000,
    user_name: 'testuser',
    full_name: 'Test User',
    email: 'testuser@testmail.com',
    // password is: testUser@123
    password: '79507cc77b749c1f73731985047114a3c06616552f0766a73a1b7a1b296e19685547045a5b28a1d5386f4656aa0c0ca7c7ccfefb31009a1a5942e57604122452',
    cover_image: 'https://steamuserimages-a.akamaihd.net/ugc/187297348924941474/E14283CF3768FD1F0CAFC36C27BF2F41164B697F/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false',
    avatar: 'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/fe/feb60c75706d9ed2533669dd58205eca4201d775_full.jpg',
    bio: 'This is test user bio',
    meta_title: 'Meta title for test user',
    meta_description: 'Meta description for test user',
    locale: 'en-IN',
    primary_badge: 10000000
  }
];

const certificates = [
  {
    name: 'Certificate',
    description: 'This is a certificate',
    content: 'This is the certificate content',
    created_by: 10000000
  }
];

const courses = [
  {
    certificate_id: 10000000,
    name: 'Dummy course',
    created_by: 10000000
  }
];


const courseChapters = [
  {
    chapter_no: 1,
    name: 'Chapter 1',
    slug: 'chapter_1'
  },
  {
    chapter_no: 2,
    name: 'Chapter 2',
    slug: 'chapter_2'
  },
  {
    chapter_no: 3,
    name: 'Chapter 3',
    slug: 'chapter_3'
  }
];

/******************************* */


function getIds(dataRows: any[]) {
  return dataRows.map((row) => row.id);
}

/**
 * Updates dataArray.
 *
 * If no optional params are provided this function will automatically set `created_by` for each object in `dataArray`
 * @param dataArray dataArray
 * @param extraFieldObj the object has the extra info
 * @param requiredFields list of fileds that needed to add
 * @returns none
 */
function addExtraFields(dataArray: Array<any>,
  extraFieldObj: { [x: string]: any } = { created_by }, requiredFields: any[] = ['created_by']) {

  if (dataArray.length && requiredFields) {
    for (let i = 0; i < dataArray.length; i++) {
      for (let j = 0; j < requiredFields.length; j++) {
        if (extraFieldObj[requiredFields[j]]) {
          dataArray[i][requiredFields[j]] = extraFieldObj[requiredFields[j]];
        }
      }
    }
  }
}

async function createSeedData() {
  await initServices();
  //  Create entity
  const entityResponse = await insertOne(tableNames.ENTITY_TABLE, entity);
  const entityId = entityResponse.rows[0].id;
  console.log(entityId);

  // Create user
  if (users[0]) {
    users[0].entity_id = entityId;
  }
  const usersResponse = await insertMany(tableNames.USER_TABLE, users);
  const userIds = getIds(usersResponse.rows);
  console.log(userIds);

  // setting a common userId for general use
  globalUserId = userIds[0];
  created_by = globalUserId;

  //  Create tags
  if (tags[0]) {
    tags[0].created_by = userIds[0];
  }

  addExtraFields(tags);
  const tagsResponse = await insertMany(tableNames.TAGS_TABLE, tags as unknown as [{ [x: string]: any }]);
  const tagIds = tagsResponse.rows.map((row) => row.id);
  console.log(tagIds);

  //  Create badges
  const badgesResponse = await insertMany(tableNames.BADGE_TABLE, badges);
  const badgeIds = badgesResponse.rows.map((row) => row.id);
  console.log(badgeIds);

  // TODO: Create posts

  // Create certificates
  addExtraFields(certificates);
  const courseCertificateResponse = await insertMany(tableNames.CERTIFICATES_TABLE, certificates);
  const certificateIds = getIds(courseCertificateResponse.rows);
  console.log(certificateIds);

  // create courses
  const certificate = courseCertificateResponse.rows[0];
  addExtraFields(courses,
    { certificate_id: certificate.id, created_by },
    ['certificate_id', 'created_by']);

  const courseResponse = await insertMany(tableNames.COURSE_TABLE, courses);
  console.log(courseResponse.rowCount);

  // create course chapters
  addExtraFields(courseChapters,
    { course_id: courseResponse.rows[0].id, created_by },
    ['course_id', 'created_by']);
  const courseChaptersResponse = await insertMany(tableNames.COURSE_CHAPTERS, courseChapters);
  console.log(courseChaptersResponse.rowCount);

}

createSeedData();
