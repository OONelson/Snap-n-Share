import { usePosts } from "@/hooks/usePost";
import { Timestamp } from "firebase/firestore";
import * as React from "react";

interface ITimeReuseProps {}
const TimeReuse: React.FunctionComponent<ITimeReuseProps> = () => {
  const { post } = usePosts();

  const formatTimeAgo = (createdAt: Date) => {
    const now = new Date();
    const diffInMilliseconds = createdAt.getTime();

    if (diffInMilliseconds < 60000) {
      return "just now";
    } else if (diffInMilliseconds < 3600000) {
      const minutes = Math.floor(diffInMilliseconds / 60000);
      return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInMilliseconds < 86400000) {
      const hours = Math.floor(diffInMilliseconds / 3600000);
      return `${hours} hr${hours > 1 ? "s" : ""} ago`;
    } else {
      return createdAt.toLocaleDateString();
    }
  };
  return (
    <span className="text-slate-600">
      {formatTimeAgo(
        post.createdAt instanceof Timestamp
          ? post.createdAt.toDate()
          : new Date(post.createdAt)
      )}
    </span>
  );
};

export default TimeReuse;
