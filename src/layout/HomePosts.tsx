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

interface IHomePostsProps {}

const HomePosts: React.FunctionComponent<IHomePostsProps> = () => {
  const [isScrolled, setIsScrolled] = useState(false);

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
    liked,
    toggleLike,
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
                          onClick={() => toggleLike(post.id)}
                          icon={
                            liked.includes(post.id) ? solidHeart : regularHeart
                          }
                        />
                        <span>
                          {post.likes} {post.likes === 1 ? "like" : "likes"}
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
                  <CardDescription className="ml-14">
                    <p>{post.caption}</p>
                  </CardDescription>

                  <CardContent className="ml-10">
                    <img
                      src={post.photos ? post.photos : ""}
                      alt={post.caption}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="w-[8vw] flex justify-between items-center">
                      <FontAwesomeIcon
                        className="cursor-pointer"
                        onClick={() => toggleLike(post.id)}
                        icon={
                          liked.includes(post.id) ? solidHeart : regularHeart
                        }
                      />
                      {post.likes > 0 && (
                        <span>
                          {post.likes} {post.likes === 1 ? "likes" : "like"}
                        </span>
                      )}
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
