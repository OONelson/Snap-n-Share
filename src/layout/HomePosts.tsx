// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import { useUserProfile } from "@/contexts/UserProfileContext";
// import { usePosts } from "@/hooks/useUserPost";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faHeart as regularHeart,
//   faBookmark as solidBookmark,
// } from "@fortawesome/free-regular-svg-icons";
// import {
//   faHeart as solidHeart,
//   faBookmark as regularBookmark,
//   faEllipsisV,
// } from "@fortawesome/free-solid-svg-icons";

import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostComponent from "@/components/reuseables/PostComponent";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { usePosts } from "@/hooks/useUserPost";
import { DocumentResponse } from "@/types";
interface IHomePostsProps {
  data: DocumentResponse;
}

const HomePosts: React.FunctionComponent<IHomePostsProps> = ({ data }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { userProfile, displayName, initials } = useUserProfile();
  const { searchTerm, setSearchTerm, filteredPosts } = usePosts();

  return (
    <main className=" dark:bg-darkBg h-screen  lg:w-[58vw] md:w-[88vw] ">
      <section className="dark:bg-slate-900 lg:w-[58vw]  bg-slate-100">
        <header
          className={`sticky top-0 md:my-4 my-0 px-2 py-1 transition-all dark:bg-darkBg border-b ${
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
          <div className="">
            <div className="flex">
              <Link to="/profile">
                <div className="flex mr-2 border-2 rounded-full">
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
                className="w-1/2 p-2 border rounded-lg bg-darkBg dark:text-slate-100 mb-4"
              />
            </div>
          </div>
        </header>

        <article>
          {filteredPosts.length > 0 && <PostComponent posts={filteredPosts} />}
        </article>
        <article className="h-full flex justify-center items-center">
          <PostComponent data={data} />
        </article>
      </section>
    </main>
  );
};

export default HomePosts;
