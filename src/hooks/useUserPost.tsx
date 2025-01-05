import { useEffect, useState } from "react";
import { DocumentResponse, Pos, Comment, Post } from "../types/index";
import {
  getPostByUserId,
  getPosts,
  searchPosts,
  deleteSinglePost,
} from "@/repository/post.service";
import { useUserAuth } from "@/contexts/UserAuthContext";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  deleteDoc,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db, storage } from "@/firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router-dom";

export const usePosts = () => {
  const { user } = useUserAuth();

  const [file, setFile] = useState<File | null>(null);
  const [post, setPost] = useState<Post>({
    id: "",
    caption: "",
    photos: "",
    likes: 0,
    userlikes: [],
    userId: "",
    createdAt: new Date().toISOString(),
  });
  const [posts, setPosts] = useState<DocumentResponse[]>([]);
  const [userPosts, setUserPosts] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<DocumentResponse[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const navigate = useNavigate();

  const toggleDeleteModal = (postId: string) => {
    // setOpenDeleteModal((prev) => (prev === postId ? null : postId));
    setSelectedPost((prev) => (prev === postId ? null : postId));
  };

  const closeDeleteModal = () => {
    setSelectedPost(null);
    setOpenDeleteModal(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!file || !post.caption) {
      alert("Please select a file and provide a caption.");
      return;
    }

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `posts/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Error during file upload:", error);
        },
        async () => {
          const photoURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at:", photoURL);

          const newPost: Post = {
            id: post.id,
            caption: post.caption,
            photos: photoURL,
            likes: 0,
            userlikes: [],
            userId: user?.uid,
            createdAt: new Date().toISOString(),
          };

          console.log(newPost);

          await addDoc(collection(db, "posts"), newPost);

          // Reset form state
          setFile(null);
          setPost({
            id: "",
            caption: "",
            photos: "",
            likes: 0,
            userlikes: [],
            userId: "",
            createdAt: new Date().toISOString(),
          });
          alert("Post created successfully!");
          navigate("/");
        }
      );
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const getUserPosts = async (uid: string) => {
    try {
      const querySnapshot = await getPostByUserId(uid);
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
        setUserPosts(tempArr);
        // console.log(userPosts);
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
    // const response: DocumentResponse[] = (await getPosts()) || [];

    const q = query(collection(db, "posts"), orderBy("date", "desc"));

    const querySnapshot = await getDocs(q);
    const tempArr: DocumentResponse[] = [];
    if (querySnapshot.size > 0) {
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Post;
        const responseObj: DocumentResponse = {
          id: doc.id,
          ...data,
        };
        tempArr.push(responseObj);
      });

      const enrichedPosts = await Promise.all(
        tempArr.map(async (post) => {
          const userDoc = await getDoc(doc(db, "users", post.userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            return {
              ...post,
              username: userData?.username,
              displayName: userData?.displayName,
            };
          }
          return post;
        })
      );

      // console.log(enrichedPosts);
      setPosts(enrichedPosts);
    }
  };

  const deletePost = async () => {
    !selectedPost && alert("please select a post to be deleted");

    try {
      await deleteDoc(doc(db, "posts", selectedPost));
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== selectedPost)
      );
      setSelectedPost(null);
      alert("post deleted successfully");
    } catch (error) {
      console.error("error deleting post", error);
      alert("failed to delete post");
    }
  };

  const loadBookmarks = async () => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        setBookmarked(data.bookmarks || []);
        console.log(data.bookmarks);
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

  useEffect(() => {
    if (user) {
      getUserPosts(user?.uid);
      getAllPosts();
      loadBookmarks();
    }
  }, [user]);

  const fetchFilteredPosts = async (term: string) => {
    setLoading(true);
    try {
      const results = await searchPosts(term);
      setFilteredPosts(results);
    } catch (error) {
      console.error("error searching posts", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPosts([]);
      return;
    }
    const debounce = setTimeout(() => {
      fetchFilteredPosts(searchTerm);
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  useEffect(() => {
    const fetchComments = async () => {
      const querySnapshot = await getDocs(
        collection(db, `posts/${post.id}/comments`)
      );
      const commentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as unknown as Comment[];
      setComments(commentsData);
    };

    fetchComments();
  }, [post.id]);

  const addComment = async () => {
    if (newComment.trim()) {
      await addDoc(collection(db, `posts/${post.id}/comments`), {
        id: post.id,
        author: post.displayName,
        text: newComment,
        createdAt: new Date().toISOString(),
      });
      setNewComment("");
      // Re-fetch comments after adding
      const querySnapshot = await getDocs(
        collection(db, `posts/${post.id}/comments`)
      );
      const commentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as unknown as Comment[];
      setComments(commentsData);
    }
  };

  return {
    userPosts,
    posts,
    loading,
    error,
    bookmarked,
    post,
    setPost,
    toggleBookmark,
    searchTerm,
    setSearchTerm,
    filteredPosts,
    openDeleteModal,
    handleFileChange,
    toggleDeleteModal,
    closeDeleteModal,
    deletePost,
    selectedPost,
    setSelectedPost,
    handleSubmit,
    comments,
    setComments,
    addComment,
    newComment,
    setNewComment,
  };
};
