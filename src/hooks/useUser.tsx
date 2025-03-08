import { useUserAuth } from "@/contexts/UserAuthContext";
import { db } from "@/firebase/firebaseConfig";
import { DocumentResponse, Post } from "@/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useUser = (p0: { userId: string }) => {
  const { user } = useUserAuth();

  const [userPosts, setUserPosts] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPosts = async (uid: string) => {
      if (!uid) {
        console.log("userId is undefined, not fetching posts.");
        setUserPosts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      console.log("first try");

      try {
        const q = query(
          collection(db, "posts"),
          // orderBy("date", "desc"),
          where("userId", "==", uid)
        );

        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.size);

        const tempArr: DocumentResponse[] = [];
        if (querySnapshot.size > 0) {
          querySnapshot.forEach((doc) => {
            const data = doc.data() as Post;
            const responseObj: DocumentResponse = {
              id: doc.id,
              ...data,
              userbookmarks: [],
              likedBy: [],
            };
            tempArr.push(responseObj);
            console.log("second try");
          });
          setUserPosts(tempArr);
          console.log(userPosts);
        } else {
          console.log("No posts found for this user.");
        }
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

    if (user) {
      fetchUserPosts(user?.uid);
    }
  }, [user]);

  return {
    loading,
    userPosts,
    error,
  };
};
