import CommentList from "@/components/reuseables/Commentlist";
import PostComponent from "@/components/reuseables/PostComponent";
import { Button } from "@/components/ui/button";
import {
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import * as React from "react";
import { useEffect, useState, useNavigate } from "react";
import { Link, useParams } from "react-router-dom";
import { Card } from "stream-chat-react";
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

import { auth } from "@/firebase/firebaseConfig";
import { DocumentResponse } from "@/types";
import SmallSpinner from "./SmallSpinner";

interface ISinglePostProps {}

const SinglePost: React.FunctionComponent<ISinglePostProps> = () => {
  const { userProfile, displayName, initials } = useUserProfile();
  const {
    posts,
    bookmarked,
    toggleBookmark,
    openDeleteModal,
    toggleDeleteModal,
    closeDeleteModal,
    deletePost,
    selectedPostToDelete,
    setSelectedPostToDelete,
  } = usePosts();

  const user = auth.currentUser;
  const navigate = useNavigate();

  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<DocumentResponse | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      console.log("starting");

      if (postId) {
        const postDoc = await getDoc(doc(db, "posts", postId));
        if (postDoc.exists()) {
          setPost({ id: postDoc.id, ...postDoc.data() } as DocumentResponse);
        }
        console.log("done");
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) return <p>trying to fetch posts...</p>;
  return (
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
          <div className="flex justify-between items-center w-[70px]">
            <div className="flex justify-between items-center w-[30px]">
              <FontAwesomeIcon
                className="cursor-pointer transition-all dark:hover:text-slate-400 "
                onClick={() => toggleLike(!likesInfo.isLike)}
                icon={likesInfo.isLike ? solidHeart : regularHeart}
              />
              <span>{likesInfo.likes} </span>
            </div>

            <div className="flex justify-between items-center w-[30px]">
              <FontAwesomeIcon
                className="cursor-pointer transition-all dark:hover:text-slate-400"
                onClick={() => toggleCommentSection(post.id)}
                icon={faComment}
              />
              {Comment.length > 0 && <span>{Comment.length}</span>}
            </div>
          </div>

          <FontAwesomeIcon
            className="cursor-pointer transition-all dark:hover:text-slate-400"
            onClick={() => toggleBookmark(post.id)}
            icon={
              bookmarked.includes(post.id) ? regularBookmark : solidBookmark
            }
          />
          {/* <span>
                  {new Date(post.date.seconds * 1000).toLocaleDateString()}
                </span> */}
          {/* <span>by : {post.username}</span> */}
        </CardFooter>
        {selectedPost === post.id && displayComments && (
          <CommentList postId={post.id} />
        )}
      </CardHeader>
    </Card>
  );
};

export default SinglePost;
