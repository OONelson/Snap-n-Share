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
  faBell,
  faComment,
  faBookmark as solidBookmark,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBookmark as regularBookmark,
  faEllipsisV,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import PostComponent from "@/components/reuseables/PostComponent";
import { Link } from "react-router-dom";
import { auth } from "@/firebase/firebaseConfig";
import { useEffect, useState } from "react";
import Likes from "@/components/reuseables/Likes";
import TimeReuse from "@/components/reuseables/TimeReuse";
import { DocumentResponse } from "@/types";

interface IHomePostsProps {
  data: DocumentResponse;
  currentUserId: string;
}

const HomePosts: React.FunctionComponent<IHomePostsProps> = ({
  data,
  currentUserId,
}) => {
  const {
    bookmarked,
    toggleBookmark,
    toggleDeleteModal,
    closeDeleteModal,
    deletePost,
    selectedPost,
    toggleCommentSection,
  } = usePosts();

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const user = auth.currentUser;

  const { userProfile, displayName, initials } = useUserProfile();
  const { searchTerm, setSearchTerm, filteredPosts } = usePosts();

  return (
    <main className=" dark:bg-darkBg h-screen lg:w-[58vw] md:w-[88vw]  ">
      <section className="dark:bg-slate-900 lg:w-[58vw]  bg-slate-100 ">
        <header
          className={`sticky top-0 md:my-4 mb-5 my-0 px-2 py-1 transition-all dark:bg-darkBg border-b ${
            isScrolled
              ? "backdrop-blur-md bg-white/70 shadow-md dark:bg-darkBg/70"
              : "bg-white/100 shadow-none"
          }`}
        >
          <h1 className="text-xl dark:text-slate-200 font-medium block md:hidden pb-2">
            Snap n' Share
          </h1>
          <h2 className="text-xl font-medium hidden md:block dark:text-slate-200">
            Feeds
          </h2>
          <div className="flex justify-between items-start">
            <div className="flex">
              <Link to="/profile">
                <div className="flex mr-2 border-2 rounded-full">
                  {userProfile?.photoURL ? (
                    <img
                      src={userProfile.photoURL}
                      alt={displayName}
                      className="rounded-full h-[50px] w-[50px]"
                    />
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
                className="w-1/2 p-2 border rounded-lg bg-darkBg dark:text-slate-100 mb-4 bg-white "
              />
            </div>
            <Link to={"/notifications"}>
              <FontAwesomeIcon
                icon={faBell}
                className="dark:text-slate-300 text-slate-500 text-xl cursor-pointer transition-all"
              />
            </Link>
          </div>
        </header>
        {/* {loading && <SmallSpinner />} */}
        {searchTerm && filteredPosts.length === 0 && (
          <h2 className="text-slate-200">no posts found</h2>
        )}
        <article className="mb-5">
          {filteredPosts.length > 0 &&
            filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="flex justify-start items-center mb-4 w-[90vw] lg:w-[30vw] sm:w-[45vw]"
              >
                <CardHeader>
                  <div className="flex justify-between items-center w-full md:w-full ">
                    <Link to={`/profile/${user?.uid}`}>
                      <div className="flex items-center justify-between w-full">
                        {userProfile?.photoURL ? (
                          <img
                            src={userProfile.photoURL}
                            alt={displayName}
                            className="rounded-full h-[50px] w-[50px]"
                          />
                        ) : (
                          <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black text-white  font-bold dark:border-2">
                            {initials}
                          </div>
                        )}

                        <span className="pl-2">{post.displayName}</span>
                        {post.username.length > 10 ? (
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
                  {selectedPost === post.id && (
                    <article onClick={closeDeleteModal}>
                      <div className="dark:bg-darkBg relative -mt-3">
                        <Button
                          onClick={() => deletePost}
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
                              onClick={() => toggleCommentSection(post.id!)}
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
                    <TimeReuse createdAt={post.createdAt} />
                  </CardFooter>
                </CardHeader>
              </Card>
            ))}
        </article>
        <PostComponent data={data} currentUserId={""} />
      </section>
    </main>
  );
};

export default HomePosts;
