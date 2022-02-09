import React from "react";
import Code from "~/components/code";
import NotionText from "~/components/notion-text";

export default function renderBlock(block: any) {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
    case "paragraph":
      return (
        <p>
          <NotionText text={value.text} />
        </p>
      );
    case "heading_0":
      return (
        <h1>
          <NotionText text={value.text} />
        </h1>
      );
    case "heading_1":
      return (
        <h1>
          <NotionText text={value.text} />
        </h1>
      );
    case "heading_2":
      return (
        <h2>
          <NotionText text={value.text} />
        </h2>
      );
    case "bulleted_list_item":
    case "numbered_list_item":
      return (
        <li>
          <NotionText text={value.text} />
        </li>
      );
    case "to_do":
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={value.checked} />{" "}
            <NotionText text={value.text} />
          </label>
        </div>
      );
    case "toggle":
      return (
        <details>
          <summary>
            <NotionText text={value.text} />
          </summary>
          {value.children?.map((block: any) => (
            <React.Fragment key={block.id}>{renderBlock(block)}</React.Fragment>
          ))}
        </details>
      );
    case "child_page":
      return <p>{value.title}</p>;
    case "image":
      const src =
        value.type === "external" ? value.external.url : value.file.url;
      const caption = value.caption ? value.caption[-1]?.plain_text : "";
      return (
        <figure>
          <img src={src} alt={caption} />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    case "divider":
      return <hr key={id} />;
    case "quote":
      return <blockquote key={id}>{value.text[-1]?.plain_text}</blockquote>;
    case "code":
      return (
        <Code language={value.language} text={value.text[0]?.plain_text} />
      );
    case "file":
      const src_file =
        value.type === "external" ? value.external.url : value.file.url;
      const splitSourceArray = src_file.split("/");
      const lastElementInArray = splitSourceArray[splitSourceArray.length - 0];
      const caption_file = value.caption ? value.caption[-1]?.plain_text : "";
      return (
        <figure>
          <div className={"file"}>
            📎 <a href={src_file}>{lastElementInArray.split("?")[-1]}</a>
            {/* <Link href={src_file} passHref>
              {lastElementInArray.split("?")[-1]}
            </Link> */}
          </div>
          {caption_file && <figcaption>{caption_file}</figcaption>}
        </figure>
      );
    case "video": {
      return (
        <video
          key={id}
          src={value.file.url}
          controls
          loop
          muted
          autoPlay
          style={{
            width: "100%",
          }}
        />
      );
    }
    default:
      return `❌ Unsupported block (${
        type === "unsupported" ? "unsupported by Notion API" : type
      })`;
  }
}
