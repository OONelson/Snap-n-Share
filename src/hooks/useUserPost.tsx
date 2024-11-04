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
          };
          console.log("The response object is : ", responseObj);
          tempArr.push(responseObj);
        });
        setPosts(tempArr);
        setLoading(false);
      } else {
        console.log("No such document");
      }
    } catch (error: any) {
      console.log(error);
      setError(error.msg);
    }
  };

  useEffect(() => {
    if (user != null) {
      getAllPost(user.uid);
    }
  }, []);

  return { posts, loading, error };
};
