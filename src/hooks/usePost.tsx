import { useEffect, useState } from "react";
import {
  DocumentResponse,
  Comment,
  Post,
  CommentResponse,
} from "../types/index";
import {
  getPost,
  getPostByUserId,
  // getPosts,
  searchPosts,
  updateLikesOnPost,
  // deleteSinglePost,
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
} from "firebase/firestore";
import { auth, db, storage } from "@/firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";

export const usePosts = () => {
  const { postId } = useParams<{ postId: string }>();

  // const { user } = useUserAuth();
  const user = auth.currentUser;
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
  const [singlePost, setSinglePost] = useState<DocumentResponse | null>(null);
  const [userPosts, setUserPosts] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<DocumentResponse[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedPostToDelete, setSelectedPostToDelete] = useState<
    string | null
  >(null);
  const [comments, setComments] = useState<CommentResponse[]>([]);

  const [commentText, setCommentText] = useState<string>("");

  const [displayComments, setDisplayComments] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [likesInfo, setLikesInfo] = useState<{
    likes: number;
    isLike: boolean;
  }>({
    likes: post.likes ?? 0,
    isLike: post.userlikes?.includes(user!.uid) ? true : false,
  });

  const navigate = useNavigate();

  const toggleDeleteModal = (postId: string) => {
    setSelectedPostToDelete((prev) => (prev === postId ? null : postId));
  };

  const closeDeleteModal = () => {
    setSelectedPostToDelete(null);
    setOpenDeleteModal(false);
  };

  // const toggleCommentSection = (postId: string) => {
  //   // console.log("done", postId);

  //   setSelectedPost((prev) => (prev === postId ? null : postId));
  //   setDisplayComments(true);

  //   navigate(`/post/${postId}`);
  //   // console.error(Error);
  // };

  const toggleLike = async (isVal: boolean) => {
    setLikesInfo({
      likes: isVal ? likesInfo.likes + 1 : likesInfo.likes - 1,
      isLike: !likesInfo.isLike,
    });
    isVal
      ? post.userlikes?.push(user!.uid)
      : post.userlikes?.splice(post.userlikes.indexOf(user!.uid), 1);

    await updateLikesOnPost(
      post.id!,
      post.userlikes!,
      isVal ? likesInfo.likes + 1 : likesInfo.likes - 1
    );
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

          const newPost: Post = {
            id: post.id,
            caption: post.caption,
            photos: photoURL,
            likes: 0,
            userlikes: [],
            userId: userId,
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
            ...data,
            id: doc.id,
            userbookmarks: [],
            userlikes: [],
          } as DocumentResponse;
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
        const data = doc.data() as DocumentResponse;
        const responseObj: DocumentResponse = {
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

  const getSinglePost = async () => {
    setLoading(true);
    try {
      if (!postId) return;
      const postDoc = await getDoc(doc(db, "posts", postId));
      if (postDoc.exists()) {
        const singlePostDoc: DocumentResponse = {
          id: postDoc.id,
          ...postDoc.data(),
        } as DocumentResponse;

        console.log(postDoc.id, postDoc.data());

        setSinglePost(singlePostDoc);

        console.log("found");
      } else {
        console.log("post not found");
      }
    } catch (error) {
      console.error("error fecthing post", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async () => {
    !selectedPostToDelete && alert("please select a post to be deleted");

    try {
      await deleteDoc(doc(db, "posts", selectedPostToDelete));
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== selectedPostToDelete)
      );
      setSelectedPostToDelete(null);
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
      try {
        if (postId) {
          const commentsRef = collection(db, `posts/${postId}/comments`);
          const commentsQuery = query(commentsRef, orderBy("createdAt", "asc"));
          const querySnapshot = await getDocs(commentsQuery);
          const commentsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Comment, "id">),
          })) as unknown as Comment[];
          setComments(commentsData);
        }
      } catch (error) {
        console.error("error adding comm");
      }
    };

    getSinglePost();
    fetchComments();
  }, [postId]);

  const addComment = async () => {
    if (!postId) {
      console.error("Post ID is not provided. Cannot add comment.");
      console.log("not done");

      return;
    }
    if (user && commentText) {
      const newCommentByUser: Comment = {
        // id: comment.id,
        author: post.displayName,
        authorUserId: user?.uid,
        text: commentText,
        likes: 0,
        createdAt: new Date().toISOString(),
      };
      await addDoc(
        collection(db, `posts/${postId}/comments`),
        newCommentByUser
      );
      console.log("done", newCommentByUser);

      // Re-fetch comments after adding

      setCommentText("");
      const querySnapshot = await getDocs(
        query(
          collection(db, `posts/${postId}/comments`),
          orderBy("createdAt", "asc")
        )
      );
      const commentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Comment, "id">),
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
    likesInfo,
    setLikesInfo,
    // toggleCommentSection,
    toggleLike,
    singlePost,
  };
};
