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
  addDoc,
} from "firebase/firestore";
import { db, storage } from "@/firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router-dom";

export const usePosts = () => {
  const { user } = useUserAuth();

  const [file, setFile] = useState<File | null>(null);
  const [post, setPost] = useState<Post>({
    caption: "",
    photos: "",
    likes: 0,
    userlikes: [],
    userId: "",
    date: new Date(),
  });
  const [posts, setPosts] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState<string[]>([]);

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
            caption: post.caption,
            photos: photoURL,
            likes: 0,
            userlikes: [],
            userId: user?.uid,
            date: new Date(),
          };

          console.log(newPost);

          await addDoc(collection(db, "posts"), newPost);

          // Reset form state
          setFile(null);
          setPost({
            caption: "",
            photos: "",
            likes: 0,
            userlikes: [],
            userId: "",
            date: new Date(),
          });
          alert("Post created successfully!");
          navigate("/");
        }
      );
    } catch (error) {
      console.error("Error creating post:", error);
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

  useEffect(() => {
    if (user) {
      getUserPosts(user?.uid);
      getAllPosts();
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
    handleSubmit,
  };
};
