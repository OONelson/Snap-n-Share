import { useEffect, useState } from "react";
import { DocumentResponse, Post } from "../types/index";
import { getPostByUserId } from "@/repository/post.service";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export const usePosts = () => {
  const { user } = useUserAuth();

  const [posts, setPosts] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<string[]>([]);
  const [bookmarked, setBookmarked] = useState<string[]>([]);
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
            likesNumber: 0,
          };
          tempArr.push(responseObj);
        });
        setPosts(tempArr);
      } else {
        console.log("No posts found for this user.");
      }
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarks = async () => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        setBookmarked(data.bookmarks || []);
        // setLiked(data.liked || []);
      } else {
        console.log("No bookmarks found for this user.");
      }
    }
  };

  const toggleBookmark = async (postId: string) => {
    const isBookmarked = bookmarked.includes(postId);
    const newBookmarks = isBookmarked
      ? bookmarked.filter((id) => id !== postId)
      : [...bookmarked, postId];

    setBookmarked(newBookmarks);

    const userDocRef = doc(db, "users", user?.uid);
    await setDoc(userDocRef, { bookmarks: newBookmarks }, { merge: true });
  };

  const toggleLike = async (postId: string) => {
    const isLiked = liked.includes(postId);
    const newLikedPosts = isLiked
      ? liked.filter((id) => id !== postId)
      : [...liked, postId];

    setLiked(newLikedPosts);

    const userDocRef = doc(db, "users", user?.uid);
    await setDoc(userDocRef, { liked: newLikedPosts }, { merge: true });
  };

  useEffect(() => {
    if (user) {
      getAllPost(user?.uid);
      loadBookmarks();
    }
  }, [user]);

  return {
    liked,
    posts,
    loading,
    error,
    bookmarked,
    toggleBookmark,
    toggleLike,
  };
};
