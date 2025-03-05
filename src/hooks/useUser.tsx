import { getPostByUserId } from "@/repository/post.service";
import { DocumentResponse } from "@/types";
import { useEffect, useState } from "react";

interface useUserprops {
  userId: string;
}

export const useUser = ({ userId }: useUserprops) => {
  const [userPosts, setUserPosts] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPosts = async (userId: string) => {
      setLoading(true);
      setError(null);
      console.log("first try");

      try {
        const posts = await getPostByUserId(userId);

        setUserPosts(posts);
        console.log(posts);
      } catch (err: any) {
        setError(err.message || "failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    //  const followersList = await getUserFollowers(userId);
    //  setFollowers(followersList);

    //  const followingsList = await getUserFollowings(userId);
    //  setFollowings(followingsList);
    // };

    // fetchUserProfileData(userId);\
    // if (userId) {
    fetchUserPosts(userId);
    // } else {
    // console.log("userId is undefined, not fetching posts");
    // setUserPosts([]);
    // setLoading(false);
    // }
  }, [userId]);

  return {
    loading,
    userPosts,
    error,
  };
};
