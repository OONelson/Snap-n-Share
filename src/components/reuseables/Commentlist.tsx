import * as React from "react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { usePosts } from "@/hooks/usePost";
import { Link } from "react-router-dom";
import { Input } from "../ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

interface ICommentListProps {
  postId: string | undefined;
}

const CommentList: React.FunctionComponent<ICommentListProps> = () => {
  const { comments, addComment, commentText, setCommentText } = usePosts();
  const { userProfile, displayName, initials } = useUserProfile();

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

  return (
    <article className="transition-all px-4">
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id} className="border rounded-sm p-2 mb-3">
              <div>
                {" "}
                <Link to={`/profile/${comment.authorUserId}`}>
                  <div className="flex items-center justify-start w-full">
                    {userProfile?.photoURL ? (
                      <img
                        src={userProfile.photoURL}
                        alt={displayName}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black text-white  font-bold dark:border-2">
                        {initials}
                      </div>
                    )}

                    <span className="pl-2 font-medium">{comment.author}</span>
                  </div>
                </Link>
              </div>
              <p className="mx-10 flex justify-start items-center">
                {comment.text}
              </p>
              <span className="flex justify-end items-center">
                {formatTimeAgo(new Date(comment.createdAt))}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet</p>
      )}
      <section className="flex justify-between items-center mb-5 ">
        <Input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment"
          className="w-[90%]"
        />
        <button>
          <FontAwesomeIcon onClick={addComment} icon={faPaperPlane} />
        </button>
      </section>
    </article>
  );
};

export default CommentList;
