import { db } from "@/firebase/firebaseConfig";
import { DocumentResponse, Post } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const COLLECTION_NAME = "posts";

export const createPost = (post: Post) => {
  return addDoc(collection(db, COLLECTION_NAME), post);
};

export const getPosts = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("date", "desc"));
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
      return tempArr;
    } else {
      console.log("No such document");
    }
  } catch (error) {
    console.log(error);
  }
};

export const getPostByUserId = (id: string) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy("date", "desc"),
    where("userId", "==", id)
  );
  return getDocs(q);
};

export const searchPosts = async (searchTerm: string) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("caption", ">=", searchTerm),
    where("caption", "<=", searchTerm + "\uf8ff")
  );

  const postSnapshot = await getDocs(q);
  const postsData: DocumentResponse[] = postSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as DocumentResponse[];

  return postsData;
};

export const getPost = (id: string) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return getDoc(docRef);
};

export const deletePost = (id: string) => {
  return deleteDoc(doc(db, COLLECTION_NAME, id));
};

export const updateLikesOnPost = (
  id: string,
  userlikes: string[],
  likes: number
) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return updateDoc(docRef, {
    likes,
    userlikes,
  });
};
