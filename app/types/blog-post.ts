export interface BlogPost {
  title: string;
  blocks: Block[];
}

export interface Block {
  object: Object;
  id: string;
  createdTime: Date;
  lastEditedTime: Date;
  hasChildren: boolean;
  archived: boolean;
  type: BlockType;
  paragraph?: NumberedListItem;
  numberedListItem?: NumberedListItem;
}

export interface NumberedListItem {
  text: TextElement[];
}

export interface TextElement {
  type: TextType;
  text: TextText;
  annotations: Annotations;
  plainText: string;
  href: null;
}

export interface Annotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: Color;
}

export enum Color {
  Default = "default",
}

export interface TextText {
  content: string;
  link: null;
}

export enum TextType {
  Text = "text",
}

export enum Object {
  Block = "block",
}

export enum BlockType {
  NumberedListItem = "numbered_list_item",
  Paragraph = "paragraph",
}
