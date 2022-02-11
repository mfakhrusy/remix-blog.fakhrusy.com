import { DataFunctionArgs } from "@remix-run/server-runtime";
import React from "react";
import { useLoaderData } from "remix";
import Header from "~/components/header";
import renderBlock from "~/utils/render-notion-block";
import blogStyles from "~/styles/blog.css";
import { get } from "@upstash/redis";

export function links() {
  return [{ rel: "stylesheet", href: blogStyles }];
}

export const loader = async ({ params, request }: DataFunctionArgs) => {
  const pathname = new URL(request.url).pathname;
  const { slug } = params;
  const blogPostRedis = await get(`blogPost:${slug}`);
  const { title, blocks } = JSON.parse(blogPostRedis.data);

  return {
    pageTitle: title,
    blocks,
    pathname,
  };
};

type LoaderData = Awaited<ReturnType<typeof loader>>;

export default function BlogPost() {
  const loaderData = useLoaderData<LoaderData>();

  const blocks = loaderData?.blocks ?? [];
  const pageTitle = loaderData?.pageTitle ?? "";

  return (
    <>
      <Header titlePrefix="Blog" pathname={loaderData.pathname} />
      <article className="layout blogIndex post">
        <h1>{pageTitle}</h1>
        <section>
          {blocks.map((block: any) => (
            <React.Fragment key={block.id}>{renderBlock(block)}</React.Fragment>
          ))}
          <a href="/" className={"back"}>
            ← Go home
          </a>
        </section>
      </article>
    </>
  );
}
