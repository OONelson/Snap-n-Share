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
  deleteDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

interface UsePostsProps {
  postId?: string;
  post: DocumentResponse;
  currentUserId: string;
}

export const usePosts = ({
  // postId,
  post,
  currentUserId,
}: UsePostsProps = {}) => {
  const { user } = useUserAuth();

  const [posts, setPosts] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  // const [isLiked, setIsLiked] = useState<boolean>(false);
  // const [likesCount, setLikesCount] = useState(post.likesCount);
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const toggleDeleteModal = (postId: string) => {
    setSelectedPost(postId);
    if (postId) {
      setOpenDeleteModal((prev) => !prev);
    }
  };

  const closeDeleteModal = () => {
    setSelectedPost(null);
    setOpenDeleteModal(false);
  };

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
            likesCount: 0,
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

  const deletePost = async (postId: string) => {
    selectedPost && (await deleteDoc(doc(db, "posts", postId)));
    setPosts(posts.filter((post) => post.id !== postId));
    closeDeleteModal();
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
    console.log("first clicked");
    const isLiked = liked.includes(postId);
    const newLikes = isLiked
      ? liked.filter((id) => id !== postId)
      : [...liked, postId];

    setLiked(newLikes);

    const userDocRef = doc(db, "users", user?.uid);
    await setDoc(userDocRef, { likes: newLikes }, { merge: true });

    const postRef = doc(db, "posts", postId);

    await updateDoc(postRef, {
      likes: increment(isLiked ? -1 : 1),
    });
    console.log("second clicked");
  };

  // useEffect(() => {
  //   setIsLiked(post?.likes.includes(currentUserId));
  // }, [post?.likes, currentUserId]);

  // const toggleLike = async (postId: string) => {

  //   const postRef = doc(db, "posts", postId);
  //   if (isLiked) {
  //     await updateDoc(postRef, {
  //       likes: arrayRemove(currentUserId),
  //       likesCount: post.likesCount - 1,
  //     });
  //     // setLikesCount(likesCount - 1);
  //   } else {
  //     await updateDoc(postRef, {
  //       likes: arrayUnion(currentUserId),
  //       likesCount: post.likesCount + 1,
  //     });
  //     // setLikesCount(likesCount + 1);
  //   }
  //   setIsLiked(!isLiked);

  //   console.log("second clicked");
  // };

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
    liked,
    posts,
    loading,
    error,
    bookmarked,
    toggleBookmark,
    toggleLike,
    searchTerm,
    setSearchTerm,
    filteredPosts,
    openDeleteModal,
    toggleDeleteModal,
    closeDeleteModal,
    deletePost,
    selectedPost,
  };
};
