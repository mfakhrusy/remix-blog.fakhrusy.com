import { Client } from "@notionhq/client/build/src";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { set } from "@upstash/redis";
import { NotionQueryResultObject } from "~/types/notion";

const notionClient = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getBlockChildren = async (blockId: string) => {
  const blocks = [];
  let cursor;
  while (true) {
    const { results, next_cursor } = (await notionClient.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    })) as { results: any[]; next_cursor: string };
    blocks.push(...results);
    if (!next_cursor) {
      break;
    }
    cursor = next_cursor;
  }
  return blocks;
};

const seedBlog = async (params: QueryDatabaseParameters) => {
  const response = await notionClient.databases.query({
    ...params,
  });

  const mappedResults = (
    response.results as Array<NotionQueryResultObject>
  ).map((post) => {
    const slug =
      post.properties["Slug"].type === "rich_text"
        ? post.properties["Slug"].rich_text[0]?.plain_text ?? ""
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

    return {
      id: post.id,
      slug,
      date: dateString,
      title,
      excerpt,
      isPublished,
    };
  });

  const mappedResultsStringified = JSON.stringify(mappedResults);

  set("blogIndex", mappedResultsStringified);

  for (const post of mappedResults) {
    const blocks = await getBlockChildren(post.id);
    const obj = {
      title: post.title,
      blocks,
    };

    if (post.isPublished) {
      set(`blogPost:${post.slug}`, JSON.stringify(obj));
    }
  }
};

seedBlog({ database_id: process.env.NOTION_DATABASE_ID as string });

export {};
