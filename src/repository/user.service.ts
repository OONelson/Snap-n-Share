import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const COLLECTION_NAME = "posts";

const searchUsers = async (searchTerm: string) => {
  const db = getFirestore();
  const usersRef = collection(db, "users");
  const q = query(
    usersRef,
    where("displayName", ">=", searchTerm),
    where("displayName", "<=", searchTerm + "\uf8ff")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
