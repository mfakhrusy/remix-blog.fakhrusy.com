import { ReactNode } from "react";

type Props = {
  text: Array<any>;
};

export default function NotionText({ text }: Props): any {
  if (!text) {
    return null;
  }
  return text.map((value: any, i) => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = value;
    return (
      <span
        key={i}
        className={[
          bold ? "bold" : "",
          code ? "code" : "",
          italic ? "italic" : "",
          strikethrough ? "strikethrough" : "",
          underline ? "underline" : "",
        ].join(" ")}
        style={color !== "default" ? { color } : {}}
      >
        {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
      </span>
    );
  });
}
