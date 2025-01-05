import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { usePosts } from "@/hooks/useUserPost";
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

import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "@/firebase/firebaseConfig";
import { updateLikesOnPost } from "../../repository/post.service";
import { DocumentResponse, Post } from "@/types";
import SmallSpinner from "./SmallSpinner";
import { Button } from "../ui/button";
import CommentList from "./Commentlist";

interface IPostComponentProps {
  data: DocumentResponse;
  // filteredPosts: Post[]; // Add
}

const PostComponent: React.FunctionComponent<IPostComponentProps> = ({
  data,
}) => {
  const { userProfile, displayName, initials } = useUserProfile();
  const {
    posts,
    bookmarked,
    toggleBookmark,
    openDeleteModal,
    toggleDeleteModal,
    closeDeleteModal,
    deletePost,
    selectedPost,
    setSelectedPost,
  } = usePosts();

  const user = auth.currentUser;

  const [displayComments, setDisplayComments] = useState<boolean>(false);

  const [likesInfo, setLikesInfo] = useState<{
    likes: number;
    isLike: boolean;
  }>({
    likes: data?.likes ?? 0,
    isLike: data?.userlikes?.includes(user!.uid) ? true : false,
  });

  const toggleLike = async (isVal: boolean) => {
    setLikesInfo({
      likes: isVal ? likesInfo.likes + 1 : likesInfo.likes - 1,
      isLike: !likesInfo.isLike,
    });
    isVal
      ? data.userlikes?.push(user!.uid)
      : data.userlikes?.splice(data.userlikes.indexOf(user!.uid), 1);

    await updateLikesOnPost(
      data.id!,
      data.userlikes!,
      isVal ? likesInfo.likes + 1 : likesInfo.likes - 1
    );
  };

  return (
    <article className="flex flex-col justify-center items-center lg:w-max">
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
                    <span className="pl-1 text-slate-400 text-sm">
                      @{post.username}
                    </span>
                  </div>
                </Link>

                {post.userId === user?.uid && (
                  <FontAwesomeIcon
                    icon={faEllipsisV}
                    className="text-gray-700 cursor-pointer hover:text-gray-950 dark:hover:text-gray-500 "
                    onClick={() => toggleDeleteModal(post.id)}
                  />
                )}
              </div>
              {/* DELETE MODAL */}
              {selectedPost === post.id && (
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
                <div className="flex justify-between items-center w-[70px]">
                  <div className="flex justify-between items-center w-[30px]">
                    <FontAwesomeIcon
                      className="cursor-pointer transition-all dark:hover:text-slate-400 "
                      onClick={() => toggleLike(!likesInfo.isLike)}
                      icon={likesInfo.isLike ? solidHeart : regularHeart}
                    />
                    <span>{likesInfo.likes} </span>
                  </div>
                  <FontAwesomeIcon
                    className="cursor-pointer transition-all dark:hover:text-slate-400"
                    onClick={() => setDisplayComments(!displayComments)}
                    icon={faComment}
                  />
                </div>

                <FontAwesomeIcon
                  className="cursor-pointer transition-all dark:hover:text-slate-400"
                  onClick={() => toggleBookmark(post.id)}
                  icon={
                    bookmarked.includes(post.id)
                      ? regularBookmark
                      : solidBookmark
                  }
                />
                {/* <span>
                  {new Date(post.date.seconds * 1000).toLocaleDateString()}
                </span> */}
                {/* <span>by : {post.username}</span> */}
              </CardFooter>
              {displayComments && <CommentList postId={post.id} />}
            </CardHeader>
          </Card>
        ))
      )}
    </article>
  );
};

export default PostComponent;
