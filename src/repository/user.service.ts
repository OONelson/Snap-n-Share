import { db } from "@/firebase/firebaseConfig";
import { ProfileResponse, UserProfileInfo } from "@/types";
import { collection, query, where, getDocs } from "firebase/firestore";

const COLLECTION_NAME = "users";

export const getUserProfile = async (id: string) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    let tempData: ProfileResponse = {};
    if (querySnapshot.size > 0) {
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as UserProfileInfo;
        tempData = {
          id: doc.id,
          ...userData,
        };
      });
      return tempData;
    } else {
      console.log("No such document");
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAllUsers = async (id: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const tempArr: ProfileResponse[] = [];
    if (querySnapshot.size > 0) {
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as UserProfileInfo;
        const responeObj: ProfileResponse = {
          id: doc.id,
          ...userData,
        };
        tempArr.push(responeObj);
      });
      return tempArr.filter((item) => item.id != id);
    } else {
      console.log("No such documents");
    }
  } catch (error) {
    console.log(error);
  }
};

export const searchUsers = async (searchTerm: string) => {
  const usersRef = collection(db, COLLECTION_NAME);
  const q = query(
    usersRef,
    where("displayName", ">=", searchTerm),
    where("displayName", "<=", searchTerm + "\uf8ff")
  );
  const snapshot = await getDocs(q);
  const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return results;
};
