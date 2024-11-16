import { useEffect, useState } from "react";
import { DocumentResponse, Post } from "../types/index";
import { getPostByUserId, getPosts } from "@/repository/post.service";
import { useUserAuth } from "@/contexts/UserAuthContext";
import {
  doc,
  setDoc,
  getDoc,
  where,
  query,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

interface UsePostsProps {
  postId?: string; // Make postId optional
}

export const usePosts = ({ postId }: UsePostsProps = {}) => {
  const { user } = useUserAuth();

  const [posts, setPosts] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [likeCount, setLikeCount] = useState<{ [key: string]: number }>({});
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  const getUserPosts = async (id: string) => {
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

  const getAllPosts = async () => {
    const response: DocumentResponse[] = (await getPosts()) || [];
    console.log(response);

    setPosts(response);
  };

  const loadBookmarks = async () => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        setBookmarked(data.bookmarks || []);
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
    const newLikedState = !likedPosts[postId];

    setLikedPosts((prev) => ({ ...prev, [postId]: newLikedState }));
    const newLikeCount = newLikedState
      ? (likeCount[postId] || 0) + 1
      : (likeCount[postId] || 0) - 1;

    // Update Firestore
    const postDocRef = doc(db, "posts", postId);
    await setDoc(postDocRef, { likes: newLikeCount }, { merge: true });

    // Update local state
    setLikeCount((prev) => ({ ...prev, [postId]: newLikeCount }));
  };

  useEffect(() => {
    const fetchLikeCount = async (postId: string): Promise<void> => {
      if (!postId) return; // Ensure postId is defined
      const postDocRef = doc(db, "posts", postId);
      const postDoc = await getDoc(postDocRef);
      if (postDoc.exists()) {
        setLikeCount((prev) => ({
          ...prev,
          [postId]: postDoc.data()?.likes || 0,
        }));
      }
    };

    if (postId) {
      fetchLikeCount(postId);
    }
  }, [postId]);

  useEffect(() => {
    if (user) {
      getUserPosts(user?.uid);
      getAllPosts;
      loadBookmarks();
    }
  }, [user]);

  useEffect(() => {
    const fetchFilteredPosts = async () => {
      const postsCollection = collection(db, "posts");
      const q = query(
        postsCollection,
        where("caption", ">=", searchTerm),
        where("caption", "<=", searchTerm + "\uf8ff")
      );
      const postSnapshot = await getDocs(q);
      const postsData: DocumentResponse[] = postSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DocumentResponse[];
      setFilteredPosts(postsData);
    };

    if (searchTerm) {
      fetchFilteredPosts();
    } else {
      setFilteredPosts([]);
    }
  }, [searchTerm]);

  return {
    liked: likedPosts,
    posts,
    loading,
    error,
    bookmarked,
    toggleBookmark,
    toggleLike,
    likeCount,
    searchTerm,
    setSearchTerm,
    filteredPosts,
  };
};
