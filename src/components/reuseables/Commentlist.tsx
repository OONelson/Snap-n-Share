import { useUserProfile } from "@/contexts/UserProfileContext";
import { usePosts } from "@/hooks/usePost";
import * as React from "react";
import { Link } from "react-router-dom";
import { Input } from "../ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

interface ICommentListProps {
  postId: string | undefined;
}

const CommentList: React.FunctionComponent<ICommentListProps> = () => {
  const {
    comments,
    // setComments,
    addComment,
    commentText,
    setCommentText,
    // newComment,
    // setNewComment,
    // posts,
  } = usePosts();
  const { userProfile, displayName, initials } = useUserProfile();

  return (
    <article className="transition-all">
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <div>
                {" "}
                <Link to={`/profile/${comment.authorUserId}`}>
                  <div className="flex items-center justify-between w-full">
                    {userProfile?.photoURL ? (
                      <img src={userProfile.photoURL} alt={displayName} />
                    ) : (
                      <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black text-white  font-bold dark:border-2">
                        {initials}
                      </div>
                    )}

                    <span className="pl-2">
                      {/* {post.displayName} */}
                      {comment.author}
                      user
                    </span>
                    <span className="pl-1 text-slate-400 text-sm">
                      {/* @{post.username} */}
                      @user
                    </span>
                  </div>
                </Link>
              </div>
              <div>{comment.text}</div>
              <span>{comment.createdAt.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet</p>
      )}
      <section className="flex justify-between items-center">
        <Input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment"
          className="w-[90%]"
        />
        <button disabled={!commentText}>
          <FontAwesomeIcon onClick={addComment} icon={faPaperPlane} />
        </button>
      </section>
    </article>
  );
};

export default CommentList;
