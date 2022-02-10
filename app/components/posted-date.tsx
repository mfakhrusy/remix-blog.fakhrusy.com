import { getDateStr } from "~/utils/blog-helpers";

type Props = {
  dateString: string;
};

export function PostedDate({ dateString }: Props) {
  if (dateString) {
    return (
      <div className="posted">
        <small>{getDateStr(dateString)}</small>
      </div>
    );
  } else {
    return null;
  }
}
