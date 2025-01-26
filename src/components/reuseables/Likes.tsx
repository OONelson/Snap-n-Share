import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as regularHeart,
  faHeart as solidHeart,
} from "@fortawesome/free-regular-svg-icons";
import { Post } from "@/types";

interface LikeButtonProps {
  post: Post;
  currentUserId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ post, currentUserId }) => {
  const [likes, setLikes] = useState<number>(post.likes);
  const [isLiked, setIsLiked] = useState<boolean>(() => {
    if (post && post.likedBy) {
      return post.likedBy.includes(currentUserId);
    }
    return false;
  });

  const toggleLike = async () => {
    try {
      const postRef = doc(db, "posts", post.id);
      const updatedLikes = isLiked ? likes - 1 : likes + 1;
      const updatedLikedBy = isLiked
        ? post.likedBy.filter((id) => id !== currentUserId)
        : [...post.likedBy, currentUserId];

      // Update Firestore
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
          {likes === 1 ? "like" : "likes"}
        </span>
      )}
    </>
  );
};

export default LikeButton;
