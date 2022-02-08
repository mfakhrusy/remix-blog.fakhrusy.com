import { Link, LoaderFunction, useLoaderData } from "remix";
import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import Header from "~/components/header";

import blogStyles from "~/styles/blog.module.css";
// import sharedStyles from "~/styles/shared.module.css";

import { getBlogLink, postIsPublished } from "~/utils/blog-helpers";
// import { textBlock } from 'lib/notion/renderers';
// import getNotionUsers from 'lib/notion/getNotionUsers';
// import getBlogIndex from 'lib/notion/getBlogIndex';
import { PostedDate } from "~/components/postedDate";
import { notionClient } from "~/notion.server";
import { NotionQueryResultObject } from "~/types/notion";
// import Post from 'types/post';
// import { useRouter } from 'next/router';
// import { useEffect } from 'react';

// export async function getStaticProps({ preview }) {
//   const postsTable = await getBlogIndex();

//   const authorsToGet: Set<string> = new Set();
//   const posts: Post[] = Object.keys(postsTable)
//     .map((slug) => {
//       const post = postsTable[slug];
//       // remove draft posts in production
//       if (process.env.NODE_ENV === 'production') {
//         if (!preview && !postIsPublished(post)) {
//           return null;
//         }
//       }
//       post.Authors = post.Authors || [];
//       for (const author of post.Authors) {
//         authorsToGet.add(author);
//       }
//       return post;
//     })
//     .filter(Boolean);

//   const { users } = await getNotionUsers([...authorsToGet]);

//   posts.map((post) => {
//     post.Authors = post.Authors.map((id) => users[id].full_name);
//   });

//   posts.sort((a, b) => {
//     return new Date(b.Date).getTime() - new Date(a.Date).getTime();
//   });

//   return {
//     props: {
//       preview: preview || false,
//       posts,
//     },
//     revalidate: 10,
//   };
// }

export function links() {
  return [{ rel: "stylesheet", href: blogStyles }];
}

export const loader = async () => {
  const blogPosts: QueryDatabaseResponse = await notionClient.databases.query({
    database_id: process.env.NOTION_DATABASE_ID ?? "",
  });

  // typescript type is wrong >.>
  const posts = blogPosts.results as Array<NotionQueryResultObject>;

  return {
    posts,
  };
};

type LoaderData = Awaited<ReturnType<typeof loader>>;

export default function Index() {
  const { posts } = useLoaderData<LoaderData>();

  return (
    <>
      <Header titlePrefix="Blog" />
      <div className={`layout blogIndex`}>
        <h1>Fahru's Brain Dumps</h1>
        {posts.length === 0 && (
          <p className={`noPosts`}>
            There seems to be a problem with the Notion API :( Please keep
            refreshing the page
          </p>
        )}
        {posts.map((post) => {
          const slug =
            post.properties["Slug"].type === "rich_text"
              ? post.properties["Slug"].rich_text[0]?.plain_text ?? "empty-slug"
              : "";
          const dateString =
            post.properties["Date"].type === "date"
              ? post.properties["Date"].date?.start ?? ""
              : "";
          const page =
            post.properties["Page"].type === "title"
              ? post.properties["Page"].title[0]?.plain_text ?? ""
              : "";

          return (
            <div className={`postPreview`} key={slug}>
              <h3>
                <span className={`titleContainer`}>
                  {/* {!postIsPublished(post) && (
                    <span className={`draftBadge`}>Draft</span>
                  )} */}
                  <Link to={`/${getBlogLink(slug)}`}>
                    {/* {post.properties["Page"]} */}
                    {page}
                  </Link>
                </span>
              </h3>
              <PostedDate dateString={dateString} />
            </div>
          );
        })}
      </div>
    </>
  );
}
