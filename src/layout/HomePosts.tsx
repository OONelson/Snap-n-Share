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

import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteModal from "@/components/reuseables/DeleteModal";
import { auth } from "@/firebase/firebaseConfig";
import { updateLikesOnPost } from "../repository/post.service";
import { DocumentResponse } from "@/types";

interface IHomePostsProps {
  data: DocumentResponse;
}

const HomePosts: React.FunctionComponent<IHomePostsProps> = ({ data }) => {
  const user = auth.currentUser;

  const [isScrolled, setIsScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { userProfile, displayName, initials } = useUserProfile();
  const {
    posts,
    bookmarked,
    toggleBookmark,
    searchTerm,
    setSearchTerm,
    filteredPosts,
    openDeleteModal,
    toggleDeleteModal,
    selectedPost,
  } = usePosts();

  return (
    <main className="md:w-[60vw]">
      <section>
        <header
          className={`sticky top-0  md:my-4 my-0 px-2 transition-all ${
            isScrolled
              ? "backdrop-blur-md bg-white/70 shadow-md"
              : "bg-white/100 shadow-none"
          }`}
        >
          <h1 className="text-xl font-medium block md:hidden pb-2">
            Snap n' Share
          </h1>
          <h2 className="text-xl font-medium hidden md:block">Feeds</h2>
          <div className="md:p-4">
            <div className="flex">
              <Link to="/profile">
                <div className="flex mr-2">
                  {userProfile?.photoURL ? (
                    <img src={userProfile.photoURL} alt={displayName} />
                  ) : (
                    <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black text-white  font-bold">
                      {initials}
                    </div>
                  )}
                </div>
              </Link>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts..."
                className="w-1/2 p-2 border rounded-lg mb-4"
              />
            </div>
            <ul>
              {filteredPosts.map((post) => (
                <Card
                  key={post.caption}
                  className="md:w-[40vw] flex justify-start items-center mb-4 "
                >
                  <CardHeader>
                    <div className="flex">
                      <Link to="/profile">
                        <div>
                          {userProfile?.photoURL ? (
                            <img src={userProfile.photoURL} alt={displayName} />
                          ) : (
                            <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black text-white  font-bold">
                              {initials}
                            </div>
                          )}
                          <span>{userProfile?.username}</span>
                        </div>
                      </Link>
                      <FontAwesomeIcon
                        icon={faEllipsisV}
                        className="text-gray-700"
                        onClick={() => toggleDeleteModal(post.caption)}
                      />
                    </div>
                    {openDeleteModal && selectedPost && <DeleteModal />}
                    <CardDescription>
                      <p>{post.caption}</p>
                    </CardDescription>

                    <CardContent>
                      <img src={post?.photos} alt={post.caption} />
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <div>
                        <FontAwesomeIcon
                          className="cursor-pointer"
                          onClick={() => toggleLike(!likesInfo.isLike)}
                          icon={likesInfo.isLike ? solidHeart : regularHeart}
                        />
                        <span>
                          {likesInfo.likes}{" "}
                          {likesInfo.likes === 1 ? "like" : "likes"}
                        </span>
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
              ))}
            </ul>
          </div>
        </header>

        <article className="flex flex-col justify-center items-center">
          {posts.length === 0 ? (
            <p>No post available</p>
          ) : (
            posts.map((post) => (
              <Card
                key={post.id}
                className="flex justify-start items-center mb-4 w-[90vw] md:w-[50vw]"
              >
                <CardHeader>
                  <div className="flex justify-between items-center w-60 md:w-[45vw]">
                    <Link to="/profile">
                      <div className="flex items-center justify-between w-28">
                        {userProfile?.photoURL ? (
                          <img src={userProfile.photoURL} alt={displayName} />
                        ) : (
                          <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black text-white  font-bold">
                            {initials}
                          </div>
                        )}

                        <span>{userProfile?.username}</span>
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
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div>
                      <FontAwesomeIcon
                        className="cursor-pointer"
                        onClick={() => toggleLike(!likesInfo.isLike)}
                        icon={likesInfo.isLike ? solidHeart : regularHeart}
                      />
                      <span>
                        {likesInfo.likes}{" "}
                        {likesInfo.likes === 1 ? "like" : "likes"}
                      </span>
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
      </section>
    </main>
  );
};

export default HomePosts;
