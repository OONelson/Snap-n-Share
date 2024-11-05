// src/hooks/usePosts.ts
import { useEffect, useState } from "react";
// import { onSnapshot } from "firebase/firestore";
import { DocumentResponse, Post } from "../types/index";
import { getPostByUserId } from "@/repository/post.service";
import { useUserAuth } from "@/contexts/UserAuthContext";

export const usePosts = () => {
  const { user } = useUserAuth();

  const [posts, setPosts] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const getAllPost = async (id: string) => {
    try {
      const querySnapshot = await getPostByUserId(id);
      const tempArr: DocumentResponse[] = [];
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Post;
          const responseObj: DocumentResponse = {
            id: doc.id,
            ...data,
            userbookmarks: [],
            userlikes: [],
          };
          console.log("The response object is : ", responseObj);
          tempArr.push(responseObj);
        });
        setPosts(tempArr);
        setIsLiked(tempArr.userlikes?.includes(user?.uid ?? ""));
        setIsBookmarked(tempArr.userbookmark?.includes(user?.uid ?? ""));
        setLoading(false);
      } else {
        console.log("No such document");
      }
    } catch (error: any) {
      console.log(error);
      setError(error.msg);
    }
  };

  const toggleLike = () => {
    setIsLiked((prev) => !prev);
  };

  const toggleBookmark = () => {
    setIsBookmarked((prev) => !prev);
  };

  useEffect(() => {
    if (user != null) {
      getAllPost(user.uid);
    }
  }, []);

  return {
    posts,
    loading,
    error,
    isLiked,
    isBookmarked,
    toggleBookmark,
    toggleLike,
  };
};
