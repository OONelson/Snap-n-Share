import CommentList from "@/components/reuseables/Commentlist";
import { Button } from "@/components/ui/button";
import {
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import * as React from "react";
import { Link } from "react-router-dom";
import { Card } from "stream-chat-react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { usePosts } from "@/hooks/usePost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faHeart as regularHeart,
  faBookmark as solidBookmark,
} from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as solidHeart,
  faBookmark as regularBookmark,
  faEllipsisV,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import { auth } from "@/firebase/firebaseConfig";
// import SmallSpinner from "./SmallSpinner";

interface ISinglePostProps {}

const SinglePost: React.FunctionComponent<ISinglePostProps> = () => {
  const { userProfile, displayName, initials } = useUserProfile();
  const {
    bookmarked,
    toggleBookmark,
    toggleDeleteModal,
    closeDeleteModal,
    deletePost,
    selectedPostToDelete,
    // toggleLike,
    // selectedPost,
    // displayComments,
    // likesInfo,
    // toggleCommentSection,
    // loading,
    singlePost,
  } = usePosts();

  const user = auth.currentUser;

  if (!singlePost) return <p>trying to fetch posts...</p>;
  return (
    <Card
      key={singlePost.id}
      className="flex justify-start items-center mb-4 w-[90vw] lg:w-[30vw] sm:w-[45vw]"
    >
      <CardHeader>
        <div className="flex justify-between items-center w-full md:w-full ">
          <Link to={`/profile/${user?.uid}`}>
            <div className="flex items-center justify-between w-full">
              {userProfile?.photoURL ? (
                <img src={userProfile.photoURL} alt={displayName} />
              ) : (
                <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black text-white  font-bold dark:border-2">
                  {initials}
                </div>
              )}

              <span className="pl-2">{singlePost.displayName}</span>
              <span className="pl-1 text-slate-400 text-sm">
                @{singlePost.username}
              </span>
            </div>
          </Link>

          {singlePost.userId === user?.uid && (
            <FontAwesomeIcon
              icon={faEllipsisV}
              className="text-gray-700 cursor-pointer hover:text-gray-950 dark:hover:text-gray-500 "
              onClick={() => toggleDeleteModal(singlePost.id!)}
            />
          )}
        </div>
        {/* DELETE MODAL */}
        {selectedPostToDelete === singlePost.id && (
          <article onClick={closeDeleteModal}>
            <div className="dark:bg-darkBg relative -mt-3">
              <Button
                onClick={deletePost}
                className="absolute -right-2 h-8 bg-slate-100 text-red-600 hover:bg-slate-200 dark:bg-slate-900 border"
              >
                <span className="pr-1">Delete</span>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </div>
          </article>
        )}
        <CardDescription className="ml-3">
          <p>{singlePost.caption}</p>
        </CardDescription>
        <CardContent>
          <img
            src={singlePost.photos ? singlePost.photos : ""}
            alt={singlePost.caption}
            className="w-[400px] h-[300px] "
          />
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex justify-between items-center w-[70px]">
            <div className="flex justify-between items-center w-[30px]">
              <FontAwesomeIcon
                className="cursor-pointer transition-all dark:hover:text-slate-400 "
                // onClick={() => toggleLike(!likesInfo.isLike)}
                icon={
                  // likesInfo.isLike ?
                  // solidHeart:
                  regularHeart
                }
              />
              <span>0{/* {likesInfo.likes} */}</span>
            </div>

            <div className="flex justify-between items-center w-[30px]">
              <FontAwesomeIcon
                className="cursor-pointer transition-all dark:hover:text-slate-400"
                // onClick={() => toggleCommentSection(singlePost.id!)}
                icon={faComment}
              />
              {Comment.length > 0 && <span>{Comment.length}</span>}
            </div>
          </div>

          <FontAwesomeIcon
            className="cursor-pointer transition-all dark:hover:text-slate-400"
            onClick={() => toggleBookmark(singlePost.id!)}
            icon={
              bookmarked.includes(singlePost.id!)
                ? regularBookmark
                : solidBookmark
            }
          />
          {/* <span>
                  {new Date(post.date.seconds * 1000).toLocaleDateString()}
                </span> */}
          {/* <span>by : {post.username}</span> */}
        </CardFooter>
        <CommentList postId={singlePost.id} />
      </CardHeader>
    </Card>
  );
};

export default SinglePost;
