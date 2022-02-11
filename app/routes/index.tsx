import { NavLink, useLoaderData } from "remix";
import Header from "~/components/header";
import { PostedDate } from "~/components/posted-date";
import blogStyles from "~/styles/blog.css";
import { useEffect } from "react";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { get } from "@upstash/redis";
import { BlogIndexObject } from "~/types/notion";

export function links() {
  return [{ rel: "stylesheet", href: blogStyles }];
}

export const loader = async ({ request }: DataFunctionArgs) => {
  const pathname = new URL(request.url).pathname;
  const blogIndexRedis = await get("blogIndex");
  const posts: Array<BlogIndexObject> = JSON.parse(blogIndexRedis.data);

  return {
    posts,
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
          .filter(({ isPublished }) => {
            if (isDevelopment) {
              return true;
            } else {
              return isPublished;
            }
          })
          .map(
            ({ slug, date: dateString, title, excerpt, isPublished }, id) => {
              return (
                <div className="postPreview" key={id}>
                  <div>
                    {isPublished ? null : (
                      <div className="draftBadge">Draft</div>
                    )}
                    <NavLink rel="prefetch" prefetch="render" to={slug}>
                      <h3>{title}</h3>
                    </NavLink>
                  </div>
                  <PostedDate dateString={dateString} />
                  {excerpt === "" ? null : (
                    <p className={`excerpt`}>{excerpt}</p>
                  )}
                </div>
              );
            }
          )}
      </div>
    </>
  );
}
