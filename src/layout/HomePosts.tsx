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
} from "@fortawesome/free-solid-svg-icons";

import * as React from "react";

interface IHomePostsProps {}

const HomePosts: React.FunctionComponent<IHomePostsProps> = () => {
  const { userProfile, displayName, initials } = useUserProfile();
  const {
    posts,
    bookmarked,
    toggleBookmark,
    searchTerm,
    setSearchTerm,
    filteredPosts,
  } = usePosts();
  return (
    <main>
      <header className="my-4 px-2">
        <h1 className="text-xl font-medium">Feeds</h1>
        <div className="p-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search posts..."
            className="w-full p-2 border rounded-lg mb-4"
          />
          <ul>
            {filteredPosts.map((post) => (
              <Card
                key={post.caption}
                className="flex justify-start items-center mb-4 w-[90vw]"
              >
                <CardHeader>
                  <div className="flex">
                    {userProfile?.photoURL ? (
                      <img src={userProfile.photoURL} alt={displayName} />
                    ) : (
                      <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black text-white  font-bold">
                        {initials}
                      </div>
                    )}
                    <span>{userProfile?.username}</span>
                  </div>
                  <CardDescription>
                    <p>{post.caption}</p>
                  </CardDescription>

                  <CardContent>
                    <img src={post.photos[0]?.cdnUrl} alt={post.caption} />
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    {/* <FontAwesomeIcon
                className="cursor-pointer"
                onClick={toggleLike(post.id)}
                icon={liked.includes(post.id) ? solidHeart : regularHeart}
              /> */}

                    {/* <div className="">{post.likes} likes</div> */}
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

      <article>
        {posts.map((post) => (
          <Card
            key={post.id}
            className="flex justify-start items-center ml-4 mb-4 w-[90vw]"
          >
            <CardHeader>
              <div className="flex">
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt={displayName} />
                ) : (
                  <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black text-white  font-bold">
                    {initials}
                  </div>
                )}
                <span>{userProfile?.username}</span>
              </div>
              <CardDescription>
                <p>{post.caption}</p>
              </CardDescription>

              <CardContent>
                <img src={post.photos[0]?.cdnUrl} alt={post.caption} />
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                {/* <FontAwesomeIcon
                className="cursor-pointer"
                onClick={toggleLike(post.id)}
                icon={liked.includes(post.id) ? solidHeart : regularHeart}
              /> */}

                {/* <div className="">{post.likes} likes</div> */}
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
      </article>
    </main>
  );
};

export default HomePosts;
