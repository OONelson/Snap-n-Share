import { usePosts } from "@/hooks/usePost";
import { Timestamp } from "firebase/firestore";
import * as React from "react";

interface ITimeReuseProps {
  createdAt: Timestamp | Date | string;
}
const TimeReuse: React.FunctionComponent<ITimeReuseProps> = ({ createdAt }) => {
  const { post } = usePosts();

  const formatTimeAgo = (createdAt: Date) => {
    const now = new Date();
    const diffInMilliseconds = now.getTime() - createdAt.getTime();

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

  const getDate = () => {
    if (!createdAt) {
      return null;
    }

    if (createdAt instanceof Timestamp) {
      return createdAt.toDate();
    } else if (createdAt instanceof Date) {
      return createdAt;
    } else {
      return new Date(createdAt); // Handles string or number
    }
  };

  const dateToFormat = getDate();

  return (
    <span className="text-slate-600">
      {dateToFormat && formatTimeAgo(dateToFormat)}
    </span>
  );
};

export default TimeReuse;
