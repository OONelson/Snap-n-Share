import { useEffect, useState } from "react";
import { DocumentResponse, FileEntry, PhotoMeta, Post } from "../types/index";
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
  increment,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { createPost } from "@/repository/post.service";
import { useNavigate } from "react-router-dom";

export const usePosts = () => {
  const { user } = useUserAuth();

  const [fileEntry, setFileEntry] = useState<FileEntry>({
    files: [],
  });
  const [post, setPost] = useState<Post>({
    caption: "",
    photos: [],
    likes: 0,
    userlikes: [],
    userId: "",
    date: new Date(),
  });
  const [posts, setPosts] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const navigate = useNavigate();

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

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(fileEntry.files);

    console.log(post);

    const photoMeta: PhotoMeta[] = fileEntry.files.map((file) => {
      return { cdnUrl: file.cdnUrl!, uuid: file.uuid! };
    });

    if (user != null) {
      const newPost: Post = {
        ...post,
        userId: user?.uid || null,
        photos: photoMeta,
      };
      console.log(newPost);

      await createPost(newPost);
      navigate("/");
    } else {
      navigate("/login");
    }
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
    post,
    setPost,
    toggleBookmark,
    toggleLike,
    searchTerm,
    setSearchTerm,
    filteredPosts,
    openDeleteModal,
    setFileEntry,
    fileEntry,
    toggleDeleteModal,
    closeDeleteModal,
    deletePost,
    selectedPost,
    handleSubmit,
  };
};
