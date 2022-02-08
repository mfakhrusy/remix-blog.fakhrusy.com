import { AnchorHTMLAttributes } from "react";

const ExtLink = (props: AnchorHTMLAttributes<{}>) => (
  <a {...props} rel="noopener" target={props.target || "_blank"} />
);

export default ExtLink;
