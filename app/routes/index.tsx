import { Link, useLoaderData } from "remix";
import { getDatabase } from "~/notion.server";
import Header from "~/components/header";
import { PostedDate } from "~/components/posted-date";
import blogStyles from "~/styles/blog.css";
import { useEffect } from "react";
import { DataFunctionArgs } from "@remix-run/server-runtime";

export function links() {
  return [{ rel: "stylesheet", href: blogStyles }];
}

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const pathname = new URL(request.url).pathname;
  return {
    posts: await getDatabase({
      database_id: process.env.NOTION_DATABASE_ID ?? "",
    }),
    pathname,
  };
};

type LoaderData = Awaited<ReturnType<typeof loader>>;

export default function Index() {
  const { posts, pathname } = useLoaderData<LoaderData>();

  const isDevelopment = process.env.NODE_ENV === "development";

  useEffect((): void => {
    if (sessionStorage.getItem("currentPostId")) {
      sessionStorage.removeItem("currentPostId");
    }
  }, []);

  return (
    <>
      <Header titlePrefix="Blog" pathname={pathname} />
      <div className="layout blogIndex">
        <h1 style={{ textAlign: "center" }}>Fahru's Brain Dumps</h1>
        {posts.length === 0 ? (
          <p className="noPosts">
            There seems to be a problem with the Notion API :( Please keep
            refreshing the page
          </p>
        ) : null}
        {posts
          .filter((post) => {
            const isPublished =
              post.properties["Published"]?.type === "checkbox"
                ? post.properties["Published"].checkbox ?? false
                : false;

            if (isDevelopment) {
              return true;
            } else {
              return isPublished;
            }
          })
          .map((post) => {
            const slug =
              post.properties["Slug"].type === "rich_text"
                ? post.properties["Slug"].rich_text[0]?.plain_text ??
                  "empty-slug"
                : "";
            const dateString =
              post.properties["Date"].type === "date"
                ? post.properties["Date"].date?.start ?? ""
                : "";
            const title =
              post.properties["Page"].type === "title"
                ? post.properties["Page"].title[0]?.plain_text ?? ""
                : "";
            const excerpt =
              post.properties["Excerpt"]?.type === "rich_text"
                ? post.properties["Excerpt"].rich_text[0]?.plain_text ?? ""
                : "";
            const isPublished =
              post.properties["Published"]?.type === "checkbox"
                ? post.properties["Published"].checkbox ?? false
                : false;

            return (
              <div className="postPreview" key={slug}>
                <div>
                  {isPublished ? null : <div className="draftBadge">Draft</div>}
                  <Link prefetch="intent" to={`/${slug}`}>
                    <h3>{title}</h3>
                  </Link>
                </div>
                <PostedDate dateString={dateString} />
                {excerpt === "" ? null : <p className={`excerpt`}>{excerpt}</p>}
              </div>
            );
          })}
      </div>
    </>
  );
}
