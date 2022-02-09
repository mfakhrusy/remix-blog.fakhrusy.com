// https://github.com/samuelkraft/notion-blog-nextjs/blob/master/lib/notion.js -> change to typescript and other things
import { Client } from "@notionhq/client";
import {
  GetBlockResponse,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints";
import { NotionQueryResultObject } from "./types/notion";

export const notionClient = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getDatabase = async (params: QueryDatabaseParameters) => {
  const response = await notionClient.databases.query({
    ...params,
  });
  return response.results as Array<NotionQueryResultObject>;
};

export const getPage = async (pageId: string) => {
  const response = await notionClient.pages.retrieve({ page_id: pageId });
  return response;
};

export const getPagetTitle = async (blockId: string) => {
  const parentBlock: GetBlockResponse = await notionClient.blocks.retrieve({
    block_id: blockId,
  });
  const title =
    parentBlock.type === "child_page" ? parentBlock.child_page.title : "";

  return title;
};

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
