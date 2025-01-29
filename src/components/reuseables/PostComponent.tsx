import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { usePosts } from "@/hooks/usePost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faBookmark as solidBookmark,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBookmark as regularBookmark,
  faEllipsisV,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import SmallSpinner from "./SmallSpinner";
import { Button } from "../ui/button";
import { auth } from "@/firebase/firebaseConfig";
import Likes from "./Likes";
import { Post } from "@/types";

interface IPostComponentProps {
  currentUserId: string;
}

const PostComponent: React.FunctionComponent<IPostComponentProps> = ({
  currentUserId,
}) => {
  const user = auth.currentUser;
  const { userProfile, displayName, initials } = useUserProfile();
  const {
    posts,
    bookmarked,
    toggleBookmark,
    toggleDeleteModal,
    closeDeleteModal,
    deletePost,
    selectedPostToDelete,
    // displayComments,
    // selectedPost,
    // likes,
    // isLiked,
    // toggleCommentSection,
    // handleToggleLike,
  } = usePosts();

  return (
    <article className="flex flex-col justify-center items-center lg:w-[58vw] w-full">
      {posts.length === 0 ? (
        <SmallSpinner />
      ) : (
        posts.map((post) => (
          <Card
            key={post.id}
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

                    <span className="pl-2">{post.displayName}</span>
                    {post.username?.length > 10 ? (
                      <span className="pl-1 text-slate-400 text-sm">
                        @{post.username?.substring(0, 10)}...
                      </span>
                    ) : (
                      <span className="pl-1 text-slate-400 text-sm">
                        @ {post.username}
                      </span>
                    )}
                  </div>
                </Link>

                {post.userId === user?.uid && (
                  <FontAwesomeIcon
                    icon={faEllipsisV}
                    className="text-gray-700 cursor-pointer hover:text-gray-950 dark:hover:text-gray-500 "
                    onClick={() => toggleDeleteModal(post.id!)}
                  />
                )}
              </div>
              {/* DELETE MODAL */}
              {selectedPostToDelete === post.id && (
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
                <p>{post.caption}</p>
              </CardDescription>
              <CardContent>
                <img
                  src={post.photos ? post.photos : ""}
                  alt={post.caption}
                  className="w-[400px] h-[300px] "
                />
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <section className="flex justify-between items-center">
                  <div className="flex justify-between items-center w-[70px]">
                    <div className="flex justify-between items-center w-[30px]">
                      <Likes post={post} currentUserId={currentUserId} />
                    </div>

                    <div className="flex justify-between items-center w-[30px]">
                      <Link to={`/post/${post.id}`}>
                        <FontAwesomeIcon
                          className="cursor-pointer transition-all dark:hover:text-slate-400"
                          // onClick={() => toggleCommentSection(post.id!)}
                          icon={faComment}
                        />
                      </Link>
                      {Comment.length > 0 && <span>{Comment.length}</span>}
                    </div>
                  </div>

                  <FontAwesomeIcon
                    className="cursor-pointer transition-all dark:hover:text-slate-400"
                    onClick={() => toggleBookmark(post.id!)}
                    icon={
                      bookmarked.includes(post.id!)
                        ? regularBookmark
                        : solidBookmark
                    }
                  />
                </section>
                <span>
                  {new Date(post.date.seconds * 1000).toLocaleDateString()}
                </span>
              </CardFooter>
            </CardHeader>
          </Card>
        ))
      )}
    </article>
  );
};

export default PostComponent;
