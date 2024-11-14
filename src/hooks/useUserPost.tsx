// // src/hooks/usePosts.ts
// import { useEffect, useState } from "react";
// // import { onSnapshot } from "firebase/firestore";
// import { DocumentResponse, Post } from "../types/index";
// import { getPostByUserId } from "@/repository/post.service";
// import { useUserAuth } from "@/contexts/UserAuthContext";
// import { collection, doc, setDoc } from "firebase/firestore";
// import { db } from "@/firebase/firebaseConfig";

// export const usePosts = () => {
//   const { user } = useUserAuth();

//   const [posts, setPosts] = useState<DocumentResponse[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isLiked, setIsLiked] = useState<boolean>(false);
//   const [bookmarked, setBookmarked] = useState<string[]>([]);

//   const [error, setError] = useState<string | null>(null);

//   const getAllPost = async (id: string) => {
//     try {
//       const querySnapshot = await getPostByUserId(id);
//       const tempArr: DocumentResponse[] = [];
//       if (querySnapshot.size > 0) {
//         querySnapshot.forEach((doc) => {
//           const data = doc.data() as Post;
//           const responseObj: DocumentResponse = {
//             id: doc.id,
//             ...data,
//             userbookmarks: [],
//             userlikes: [],
//           };
//           console.log("The response object is : ", responseObj);
//           tempArr.push(responseObj);
//         });
//         setPosts(tempArr);
//         // setIsLiked(tempArr.userlikes?.includes(user?.uid ?? ""));
//         // setIsBookmarked(tempArr.userbookmark?.includes(user?.uid ?? ""));
//         setLoading(false);
//       } else {
//         console.log("No such document");
//       }
//     } catch (error: any) {
//       console.log(error);
//       setError(error.msg);
//     }
//   };

//   const toggleBookmark = async (postId: string) => {
//     const isBookmarked = bookmarked.includes(postId);
//     const newBookmarks = isBookmarked
//       ? bookmarked.filter((id) => id !== postId)
//       : [...bookmarked, postId];
//     console.log(bookmarked);

//     setBookmarked(newBookmarks);

//     const userDocRef = doc(db, "users", user?.uid);
//     await setDoc(userDocRef, { bookmarks: newBookmarks }, { merge: true });
//   };
//   // const toggleLike = () => {
//   //   setIsLiked((prev) => !prev);
//   // };

//   // const toggleBookmark = () => {
//   //   setIsBookmarked((prev) => !prev);
//   // };

//   useEffect(() => {
//     if (user != null) {
//       getAllPost(user.uid);
//     }
//   }, []);

//   return {
//     posts,
//     loading,
//     error,
//     isLiked,
//     bookmarked,
//     toggleBookmark,
//     // toggleLike,
//   };
// };

// src/hooks/usePosts.ts
import { useEffect, useState } from "react";
import { DocumentResponse, Post } from "../types/index";
import { getPostByUserId } from "@/repository/post.service";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export const usePosts = () => {
  const { user } = useUserAuth();

  const [posts, setPosts] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
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
      getAllPost(user.uid);
      loadBookmarks(); // Load bookmarks when user changes
    }
  }, [user]);

  return {
    posts,
    loading,
    error,
    bookmarked,
    toggleBookmark,
  };
};
