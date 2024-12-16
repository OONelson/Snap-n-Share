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
  faHeart as regularHeart,
  faBookmark as solidBookmark,
} from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as solidHeart,
  faBookmark as regularBookmark,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";
import { Link } from "react-router-dom";
import DeleteModal from "@/components/reuseables/DeleteModal";
import { auth } from "@/firebase/firebaseConfig";
import { updateLikesOnPost } from "../../repository/post.service";
import { DocumentResponse } from "@/types";

interface IPostComponentProps {
  data: DocumentResponse;
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
    selectedPost,
  } = usePosts();

  const user = auth.currentUser;

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
        <p>No post available</p>
      ) : (
        posts.map((post) => (
          <Card
            key={post.id}
            className="flex justify-start items-center mb-4 w-[90vw] lg:w-[30vw] sm:w-[45vw]"
          >
            <CardHeader>
              <div className="flex justify-between items-center w-full md:w-full ">
                <Link to="/profile">
                  <div className="flex items-center justify-between w-full">
                    {userProfile?.photoURL ? (
                      <img src={userProfile.photoURL} alt={displayName} />
                    ) : (
                      <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black text-white  font-bold dark:border-2">
                        {initials}
                      </div>
                    )}

                    <span className="pl-2">{userProfile?.username}</span>
                  </div>
                </Link>
                <FontAwesomeIcon
                  icon={faEllipsisV}
                  className="text-gray-700 cursor-pointer hover:text-gray-950"
                  onClick={toggleDeleteModal}
                />
              </div>
              {openDeleteModal && selectedPost && <DeleteModal />}
              <CardDescription className="ml-8">
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
                <div>
                  <FontAwesomeIcon
                    className="cursor-pointer"
                    onClick={() => toggleLike(!likesInfo.isLike)}
                    icon={likesInfo.isLike ? solidHeart : regularHeart}
                  />
                  <span>{likesInfo.likes} </span>
                </div>

                <FontAwesomeIcon
                  className="cursor-pointer"
                  onClick={() => toggleBookmark(post.id)}
                  icon={
                    bookmarked.includes(post.id)
                      ? regularBookmark
                      : solidBookmark
                  }
                />
              </CardFooter>
            </CardHeader>
          </Card>
        ))
      )}
    </article>
  );
};

export default PostComponent;
