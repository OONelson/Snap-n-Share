import PostComponent from "@/components/reuseables/PostComponent";
import { db } from "@/firebase/firebaseConfig";
import { DocumentResponse } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface ISinglePostProps {}

const SinglePost: React.FunctionComponent<ISinglePostProps> = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<DocumentResponse | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      console.log("starting");

      if (postId) {
        const postDoc = await getDoc(doc(db, "posts", postId));
        if (postDoc.exists()) {
          setPost({ id: postDoc.id, ...postDoc.data() } as DocumentResponse);
        }
        console.log("done");
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) return <p>trying to fetch posts...</p>;
  return <PostComponent />;
};

export default SinglePost;
