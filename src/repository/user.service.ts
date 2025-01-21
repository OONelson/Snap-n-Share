import { UserProfileInfo } from "./../types/index";
import { db } from "@/firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

const COLLECTION_NAME = "users";

export const getUserProfile = async (userId: string) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME, userId),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
      let tempData: UserProfileInfo | null = null;
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as UserProfileInfo;
        tempData = {
          uid: doc.id,
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

// export const getUserProfile = async (userId: string) => {
//   const userDocRef =       collection(db, COLLECTION_NAME, userId),

//   const userDoc = await getDoc(userDocRef);

//   if (userDoc.exists()) {
//     return { uid: userId, ...userDoc.data() };
//   } else {
//     console.error("User document not found");
//     return null;
//   }
// };

export const getAllUsers = async (uid: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const tempArr: UserProfileInfo[] = [];
    if (querySnapshot.size > 0) {
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as UserProfileInfo;
        const responeObj: UserProfileInfo = {
          ...userData,
          uid: doc.id,
        };
        tempArr.push(responeObj);
      });
      return tempArr.filter((item) => item.uid != uid);
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
  // console.log(doc.data());

  // console.log(results);

  return results;
};
