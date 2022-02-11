import { DataFunctionArgs } from "@remix-run/server-runtime";
import React from "react";
import { useLoaderData } from "remix";
import Header from "~/components/header";
import { getBlockChildren, getDatabase } from "~/notion.server";
import renderBlock from "~/utils/render-notion-block";
import blogStyles from "~/styles/blog.css";

export function links() {
  return [{ rel: "stylesheet", href: blogStyles }];
}

export const loader = async ({ params, request }: DataFunctionArgs) => {
  const pathname = new URL(request.url).pathname;
  const { slug } = params;
  const filteredDatabase = await getDatabase({
    database_id: process.env.NOTION_DATABASE_ID ?? "",
    filter: {
      property: "Slug",
      rich_text: {
        equals: slug ?? "",
      },
    },
  });

  const pageTitle = filteredDatabase[0].properties["Page"].type === "title" ? (
    filteredDatabase[0].properties["Page"].title[0].plain_text
  ) : "";
  const blocks = await getBlockChildren(filteredDatabase[0].id);

  return {
    pageTitle,
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
          {blocks.map((block) => (
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
