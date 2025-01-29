import React, { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { DocumentResponse } from "@/types";
import { useUserAuth } from "@/contexts/UserAuthContext";

interface LikeButtonProps {
  post: DocumentResponse;
}

const LikeButton: React.FC<LikeButtonProps> = ({ post }) => {
  const [likes, setLikes] = useState<number>(post.likes || 0);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const { user } = useUserAuth();

  useEffect(() => {
    if (!post) return;

    const postRef = doc(db, "posts", post.id);

    const unsubscribe = onSnapshot(postRef, (doc) => {
      const updatedPost = doc.data() as DocumentResponse;
      if (updatedPost) {
        setLikes(updatedPost.likes || 0);
        setIsLiked(updatedPost.likedBy?.includes(user.uid) || false);
      }
    });

    return () => unsubscribe();
  }, [post, user?.uid]);

  const toggleLike = async () => {
    console.log("first");

    if (!post) return;
    console.log(post, "second");

    const postRef = doc(db, "posts", post.id);
    const updatedLikes = isLiked ? likes - 1 : likes + 1;

    const currentlyLikedBy = post.likedBy || [];

    const updatedLikedBy = isLiked
      ? currentlyLikedBy.filter((id) => id !== user?.uid)
      : [...currentlyLikedBy, user?.uid];
    try {
      // Update Firestore
      console.log("third");

      await updateDoc(postRef, {
        likes: updatedLikes,
        likedBy: updatedLikedBy,
      });

      // Update UI instantly
      setLikes(updatedLikes);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  return (
    <>
      <FontAwesomeIcon
        className="cursor-pointer transition-all dark:hover:text-slate-400 "
        onClick={toggleLike}
        icon={isLiked ? solidHeart : regularHeart}
      />
      {likes > 0 && (
        <span>
          {likes}
          {/* {likes === 1 ? "like" : "likes"} */}
        </span>
      )}
    </>
  );
};

export default LikeButton;
