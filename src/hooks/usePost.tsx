import React, { useEffect, useRef, useState } from "react";
import { DocumentResponse, Post, CommentResponse } from "../types/index";
import { searchPosts } from "@/repository/post.service";
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
  where,
} from "firebase/firestore";
import { auth, db, storage } from "@/firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/contexts/UserProfileContext";

export const usePosts = () => {
  // const { postId } = useParams<{ postId: string }>();

  const { userProfile } = useUserProfile();
  const user = auth.currentUser;
  const [file, setFile] = useState<File | null>(null);
  const [post, setPost] = useState<Post>({
    id: "",
    caption: "",
    photos: "",
    likes: 0,
    likedBy: [],
    userId: "",
    username: "",
    displayName: "",
    createdAt: new Date().toISOString(),
  });
  const [posts, setPosts] = useState<DocumentResponse[]>([]);
  // const [singlePost, setSinglePost] = useState<DocumentResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<DocumentResponse[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedPostToDelete, setSelectedPostToDelete] = useState<string>("");
  const [comments, setComments] = useState<CommentResponse[]>([]);

  const [commentText, setCommentText] = useState<string>("");

  const [displayComments, setDisplayComments] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const navigate = useNavigate();

  const toggleDeleteModal = (postId: string) => {
    setSelectedPostToDelete(() => postId && postId);
  };

  const closeDeleteModal = () => {
    setSelectedPostToDelete("");
    setOpenDeleteModal(false);
  };

  const toggleCommentSection = (postId: string) => {
    console.log("done", postId);

    setSelectedPost((prev) => (prev === postId ? null : postId));
    setDisplayComments(true);

    // navigate(`/post/${postId}`);
    console.error(Error);
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
    const userId = user.uid;

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

          const docRef = await addDoc(collection(db, "posts"), {
            caption: post.caption,
            photos: photoURL,
            likes: 0,
            likedBy: [],
            // username: userProfile!.username,
            displayName: userProfile?.displayName,
            userId: userId,
            createdAt: new Date().toISOString(),
          });
          console.log(docRef);

          // Reset form state
          setFile(null);

          const newPost: Post = {
            id: docRef.id,
            caption: post.caption,
            photos: photoURL,
            likes: post.likes,
            likedBy: post.likedBy,
            username: userProfile!.username,
            displayName: userProfile?.displayName,
            userId: userId,
            createdAt: new Date().toISOString(),
          };

          alert("Post created successfully!");
          navigate("/");
          console.log("newpost", newPost);

          return newPost;
        }
      );
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const getAllPosts = async () => {
    try {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

      const querySnapshot = await getDocs(q);
      const tempArr: DocumentResponse[] = [];
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          const data = doc.data() as DocumentResponse;
          const responseObj = {
            ...data,
            id: doc.id,
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
                id: post.id,
                username: userData?.username,
                displayName: userData?.displayName,
              };
            } else {
              return {
                ...post,
                id: post.id,
                username: "unknown User",
                displayName: "unknown User",
              };
            }
          })
        );

        setPosts(enrichedPosts);
        return post;
      }
    } catch (error: any) {
      console.log("error fecthing posts", error);
      setError(error);
    }
  };

  const deletePost = async () => {
    !selectedPostToDelete && alert("please select a post to be deleted");

    try {
      await deleteDoc(doc(db, "posts", selectedPostToDelete));
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== selectedPostToDelete)
      );
      setSelectedPostToDelete("");
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
        // console.log(data.bookmarks);
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

    const userDocRef = doc(db, "users", user!.uid);
    await setDoc(userDocRef, { bookmarks: newBookmarks }, { merge: true });
  };

  useEffect(() => {
    if (user) {
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

  const fetchComments = async (postId: string | undefined) => {
    try {
      if (postId) {
        const querySnapshot = await getDocs(
          query(
            collection(db, "comments"),
            where("postId", "==", post.id),
            orderBy("createdAt", "asc")
          )
        );
        const commentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CommentResponse[];
        setComments(commentsData);
      }
    } catch (error) {
      console.error("error adding comm", error);
    }
  };
  useEffect(() => {
    fetchComments(post.id);
  }, [post.id]);

  const addComment = async (postId: string) => {
    if (!postId) {
      console.error("Post ID is not provided. Cannot add comment.");
      console.log("not done");

      return;
    }
    try {
      if (user && commentText) {
        const newCommentByUser = {
          postId: post.id,
          author: userProfile?.displayName || userProfile?.username,
          authorUserId: userProfile?.uid,
          text: commentText,
          likes: 0,
          createdAt: new Date().toISOString(),
        };
        console.log("done", newCommentByUser);

        await addDoc(collection(db, "comments"), newCommentByUser);
        console.log("done", newCommentByUser);

        // Re-fetch comments after adding

        setCommentText("");

        const querySnapshot = await getDocs(
          query(
            collection(db, "comments"),
            where("postId", "==", post.id),
            orderBy("createdAt", "asc")
          )
        );
        const commentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CommentResponse[];
        setComments(commentsData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    // userPosts,
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
    handleImageClick,
    fileInputRef,
    toggleDeleteModal,
    closeDeleteModal,
    deletePost,
    selectedPostToDelete,
    setSelectedPostToDelete,
    handleSubmit,
    comments,
    setComments,
    addComment,
    commentText,
    setCommentText,
    displayComments,
    setDisplayComments,
    selectedPost,
    setSelectedPost,
    toggleCommentSection,
  };
};
