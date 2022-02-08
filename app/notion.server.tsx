// https://github.com/samuelkraft/notion-blog-nextjs/blob/master/lib/notion.js -> change to typescript
import { Client } from "@notionhq/client";

export const notionClient = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getDatabase = async (databaseId: string) => {
  const response = await notionClient.databases.query({
    database_id: databaseId,
  });
  return response.results;
};

export const getPage = async (pageId: string) => {
  const response = await notionClient.pages.retrieve({ page_id: pageId });
  return response;
};

export const getBlocks = async (blockId: string) => {
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
