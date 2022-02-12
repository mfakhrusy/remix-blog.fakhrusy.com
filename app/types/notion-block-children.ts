export interface NotionBlockChildren {
  object: string;
  results: Result[];
  next_cursor: string;
  has_more: boolean;
}

export interface Result {
  object: Object;
  id: string;
  created_time: Date;
  last_edited_time: Date;
  has_children: boolean;
  archived: boolean;
  type: ResultType;
  paragraph?: Paragraph;
  code?: Code;
  image?: Image;
}

export interface Code {
  caption: any[];
  text: TextElement[];
  language: Language;
}

export enum Language {
  Bash = "bash",
  CSS = "css",
  Typescript = "typescript",
}

export interface TextElement {
  type: TextType;
  text: TextText;
  annotations: Annotations;
  plain_text: string;
  href: null | string;
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
  link: Link | null;
}

export interface Link {
  url: string;
}

export enum TextType {
  Text = "text",
}

export interface Image {
  caption: any[];
  type: string;
  file: File;
}

export interface File {
  url: string;
  expiry_time: Date;
}

export enum Object {
  Block = "block",
}

export interface Paragraph {
  text: TextElement[];
}

export enum ResultType {
  Code = "code",
  Image = "image",
  Paragraph = "paragraph",
}
