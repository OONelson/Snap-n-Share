import { UserProfileInfo } from "./../types/index";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

const COLLECTION_NAME = "users";

export const getUserProfile = async (userId: string) => {
  try {
    const userDocRef = doc(db, COLLECTION_NAME, userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      console.log(userDocRef);
      return {
        id: userDocSnap.id,
        ...userDocSnap.data(),
      };
      
    } else {
      console.log("user not found");
      return null;
    }
  } catch (error) {
    console.log("error fetching user profile", error);
    return null;
  }
};

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

  return results;
};

// Function to fetch user's followers.
// export const getUserFollowers = async (userId: string) => {
//   try {
//     const followersQuery = query(
//       collection(db, 'followers'),
//       where('followingId', '==', userId)
//     );
//     const followersSnapshot = await getDocs(followersQuery);

//     const followers = followersSnapshot.docs.map(async (followerDoc) => {
//       const followerData = followerDoc.data();
//       const followerUserDoc = await getDoc(
//         doc(db, 'users', followerData.followerId)
//       );
//       if(followerUserDoc.exists()){
//         return {
//           id: followerUserDoc.id,
//           ...followerUserDoc.data(),
//         };
//       } else {
//         return null;
//       }

//     });
//     const result = await Promise.all(followers);
//     return result.filter(user => user !== null);
//   } catch (error) {
//     console.error('Error fetching user followers:', error);
//     return [];
//   }
// };

// // Function to fetch user's followings.
// export const getUserFollowings = async (userId: string) => {
//   try {
//     const followingsQuery = query(
//       collection(db, 'followers'),
//       where('followerId', '==', userId)
//     );
//     const followingsSnapshot = await getDocs(followingsQuery);

//     const followings = followingsSnapshot.docs.map(async (followingDoc) => {
//       const followingData = followingDoc.data();
//       const followingUserDoc = await getDoc(
//         doc(db, 'users', followingData.followingId)
//       );
//       if(followingUserDoc.exists()){
//         return {
//           id: followingUserDoc.id,
//           ...followingUserDoc.data(),
//         };
//       } else {
//         return null;
//       }
//     });

//     const result = await Promise.all(followings);
//     return result.filter(user => user !== null);
//   } catch (error) {
//     console.error('Error fetching user followings:', error);
//     return [];
//   }
// };
