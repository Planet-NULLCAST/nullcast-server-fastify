import fs from 'fs';
import prettier  from 'prettier';
import { Client, QueryConfig } from 'pg';
import initServices from '../initialize-services';
import {
  CHAPTER_TABLE, COURSE_TABLE, EVENT_TABLE, POST_TABLE, USER_TABLE
} from '../constants/tables';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();


//Function to fetch all users from db
async function getAllUserNames() {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const getUsersQuery: QueryConfig = {
      text: `SELECT slug 
        FROM ${USER_TABLE};`
    };
    const usernames = await postgresClient.query(getUsersQuery);
    return usernames.rows as {slug: string}[];
  } catch (err) {
    throw err;
  }
}

//Function to fetch all posts from db
async function getAllPosts() {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const getPostsQuery: QueryConfig = {
      text: `SELECT slug 
        FROM ${POST_TABLE}
        WHERE status = 'published';`
    };
    const posts = await postgresClient.query(getPostsQuery);
    return posts.rows as {slug: string}[];
  } catch (err) {
    throw err;
  }
}

//Function to fetch all events from db
async function getAllEvents() {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const getEventsQuery: QueryConfig = {
      text: `SELECT slug 
        FROM ${EVENT_TABLE}
        WHERE status = 'published';`
    };
    const events = await postgresClient.query(getEventsQuery);
    return events.rows as {slug: string}[];
  } catch (err) {
    throw err;
  }
}

//Function to fetch all courses and their respective chapters from db
async function getAllCoursesAndChapters() {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const getCoursesAndChaptersQuery: QueryConfig = {
      text: `SELECT courses.id, courses.name, courses.slug, 
              JSON_AGG(JSON_BUILD_OBJECT('name', cc.name, 'slug', cc.slug)) as chapters 
              from ${COURSE_TABLE} AS courses
              LEFT JOIN ${CHAPTER_TABLE} AS cc ON cc.course_id = courses.id
              GROUP BY courses.id;`
    };
    const courses = await postgresClient.query(getCoursesAndChaptersQuery);
    return courses.rows;
  } catch (err) {
    throw err;
  }
}

//Main function for sitemap generation
export async function generateSitemap() {
  await initServices(); //To connect to postgres
  try {

    const mainSitemap = []; // This array is used for the root sitemap.
    const dirname = './server'; // The project directory.
    const APP_URL = process.env.APP_URL || 'https://nullcast.dev/'; // Configure the app url.
    const formatted = (sitemap: string) => prettier.format(sitemap, {
      parser: 'html'
    });

    const getDate = new Date().toISOString();

    const AllUserNames = await getAllUserNames();
    const AllPosts = await getAllPosts();
    const AllEvents = await getAllEvents();
    const courses = await getAllCoursesAndChapters();


    /* sitemap-user-profiles-[number].xml section*/
    const siteMapUserNameData = AllUserNames
      .map((user) => `
      <url>
        <loc>${APP_URL}u/${user.slug}</loc>
        <lastmod>${getDate}</lastmod>
      </url>`); // Generating user profile urls for sitemap if anything wrong in user profile urls please look at this.

    for (let i = 0; i < siteMapUserNameData.length; i += 1000) { // This is where the main sitemap for userprofile is created and split into 1000 entry for each.
      let generatedSitemapSlice1 = '';
      let sitemapSlice = '';
      if (i + 1000 > siteMapUserNameData.length) {
        console.log(siteMapUserNameData.slice(i, siteMapUserNameData.length).length);
        sitemapSlice = `${siteMapUserNameData.slice(i, siteMapUserNameData.length).join('')}`;
        generatedSitemapSlice1 = `<?xml version="1.0" encoding="UTF-8"?>
                                  <urlset
                                  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
                                  >
                                  ${sitemapSlice}
                                  </urlset>`;
      } else {
        console.log(siteMapUserNameData.slice(i, i + 1000).length);
        sitemapSlice = `${siteMapUserNameData.slice(i, i+1000).join('')}`;
        generatedSitemapSlice1 = `<?xml version="1.0" encoding="UTF-8"?>
                                  <urlset
                                  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
                                  >
                                  ${sitemapSlice}
                                  </urlset>`;
      }
      const formattedSitemap2 = formatted(generatedSitemapSlice1);
      fs.writeFileSync(`${dirname}/public/sitemap-user-profiles-${(i/1000)+1}.xml`, formattedSitemap2, 'utf8'); // Configure the user profile sitemap here.
      mainSitemap.push(`${APP_URL}sitemap-user-profiles-${(i/1000)+1}.xml`); // Pushing the created sitemap to main sitemap entry.
    }

    /* sitemap-posts-[number].xml section */
    const siteMapPostsData = AllPosts
      .map((post) => `
        <url>
          <loc>${APP_URL}${post.slug}</loc>
          <lastmod>${getDate}</lastmod>
        </url>`); // Generating Posts urls for sitemap if anything wrong in user Pots Urls please look at this.

    for (let i = 0; i < siteMapPostsData.length; i += 1000) {
      let generatedSitemapSlice1 = '';
      let sitemapSlice = '';
      if (i + 1000 > siteMapPostsData.length) {
        console.log(siteMapPostsData.slice(i, siteMapPostsData.length).length);
        sitemapSlice = `${siteMapPostsData.slice(i, siteMapPostsData.length).join('')}`;
        generatedSitemapSlice1 = `<?xml version="1.0" encoding="UTF-8"?>
                                    <urlset
                                    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
                                    >
                                    ${sitemapSlice}
                                    </urlset>`;
      } else {
        console.log(siteMapPostsData.slice(i, i + 1000).length);
        sitemapSlice = `${siteMapPostsData.slice(i, i+1000).join('')}`;
        generatedSitemapSlice1 = `<?xml version="1.0" encoding="UTF-8"?>
                                    <urlset
                                    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
                                    >
                                    ${sitemapSlice}
                                    </urlset>`;
      }
      const formattedSitemap2 = formatted(generatedSitemapSlice1);
      fs.writeFileSync(`${dirname}/public/sitemap-posts-${(i/1000)+1}.xml`, formattedSitemap2, 'utf8'); // Configure the posts sitemap here.
      mainSitemap.push(`${APP_URL}sitemap-posts-${(i/1000)+1}.xml`); // Pushing the created sitemap to main sitemap entry.
    }
    /* sitemap-events-[number].xml section */
    const siteMapEventsData = AllEvents
      .map((event) => `
        <url>
          <loc>${APP_URL}e/${event.slug}</loc>
          <lastmod>${getDate}</lastmod>
        </url>`); // Generating Events urls for sitemap if anything wrong in user Events Urls please look at this.

    for (let i = 0; i < siteMapEventsData.length; i += 1000) {
      let generatedSitemapSlice1 = '';
      let sitemapSlice = '';
      if (i + 1000 > siteMapEventsData.length) {
        console.log(siteMapEventsData.slice(i, siteMapEventsData.length).length);
        sitemapSlice = `${siteMapEventsData.slice(i, siteMapEventsData.length).join('')}`;
        generatedSitemapSlice1 = `<?xml version="1.0" encoding="UTF-8"?>
                                    <urlset
                                    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
                                    >
                                    ${sitemapSlice}
                                    </urlset>`;
      } else {
        console.log(siteMapEventsData.slice(i, i + 1000).length);
        sitemapSlice = `${siteMapEventsData.slice(i, i+1000).join('')}`;
        generatedSitemapSlice1 = `<?xml version="1.0" encoding="UTF-8"?>
                                    <urlset
                                    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
                                    >
                                    ${sitemapSlice}
                                    </urlset>`;
      }
      const formattedSitemap2 = formatted(generatedSitemapSlice1);
      fs.writeFileSync(`${dirname}/public/sitemap-events-${(i/1000)+1}.xml`, formattedSitemap2, 'utf8'); // Configure the events sitemap here.
      mainSitemap.push(`${APP_URL}sitemap-events-${(i/1000)+1}.xml`); // Pushing the created sitemap to main sitemap entry.
    }

    //The courses section.
    const course = [];

    for (let i = 0; i < courses.length; i++) {
      // This is where sitemap-[coursename].xml is created.
      const chapters = [];
      for (let j = 0; j < courses[i].chapters.length; j++) {
        chapters.push(`${APP_URL}curriculum/${courses[i].slug}/${courses[i].chapters[j].slug}`);
      }
      const siteMapCoursesData = chapters
        .map((cou) => `
      <url>
        <loc>${cou}</loc>
        <lastmod>${getDate}</lastmod>
      </url>`);
      const generatedSitemapSlice = `<?xml version="1.0" encoding="UTF-8"?>
                                    <urlset
                                    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
                                    >
                                    ${siteMapCoursesData}
                                    </urlset>`;
      const formattedSitemap = formatted(generatedSitemapSlice);
      fs.writeFileSync(`${dirname}/public/sitemap-${courses[i].slug}.xml`, formattedSitemap, 'utf8');
      course.push(courses[i].slug); // Pushing the created sitemap into sitemap-courses.xml
    }

    // sitemap-courses.xml Section.
    const siteMapCoursesList = course
      .map((couLis) => `
      <url>
        <loc>${APP_URL}sitemap-${couLis}.xml</loc>
        <lastmod>${getDate}</lastmod>
      </url>`);
    const generatedSitemapCourseList = `<?xml version="1.0" encoding="UTF-8"?>
                                    <urlset
                                    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
                                    >
                                    ${siteMapCoursesList}
                                    </urlset>`;
    const formattedSitemap = formatted(generatedSitemapCourseList);
    fs.writeFileSync(`${dirname}/public/sitemap-courses.xml`, formattedSitemap, 'utf8');
    mainSitemap.push(`${APP_URL}sitemap-courses.xml`); // Pushing the created sitemap to main sitemap entry.

    const pages = ['blog', 'login', 'signup']; // Please add common pages here.

    const commonPageSitemap = `
    ${pages
    .map((path) => `
      <url>
        <loc>${APP_URL}${path}</loc>
        <lastmod>${getDate}</lastmod>
      </url>`)
    .join('')}
    `;


    const generatedCommonPageSitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
    >
    ${commonPageSitemap}
    </urlset>
    `;

    const formattedCommonPageSitemap = formatted(generatedCommonPageSitemap);

    fs.writeFileSync(`${dirname}/public/sitemap-common.xml`, formattedCommonPageSitemap, 'utf8'); // Configure the common sitemap directory here.
    mainSitemap.push(`${APP_URL}sitemap-common.xml`); // Pushing the created sitemap to main sitemap entry.


    /* Root Sitemap(sitemap.xml) section*/
    const mainSitemapData = `
    ${mainSitemap
    .map((path) => `
      <url>
        <loc>${path}</loc>
        <lastmod>${getDate}</lastmod>
      </url>`)
    .join('')}
    `;


    const generatedMainSitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
    >
    ${mainSitemapData}
    </urlset>
    `;

    const formattedMainSitemap = formatted(generatedMainSitemap);
    fs.writeFileSync(`${dirname}/public/sitemap.xml`, formattedMainSitemap, 'utf8'); // Configure root sitemap directory here.

    console.log('sitemap generated');
  } catch (err) {
    throw err;
  }
}

generateSitemap();
