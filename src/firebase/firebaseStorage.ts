import { storage, db } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const uploadImage = async (file: File, postId: string) => {
  try {
    const storageRef = ref(storage, `images/${postId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Save image URL to Firestore
    const postRef = doc(db, "posts", postId);
    await setDoc(
      postRef,
      {
        imageUrl: downloadURL,
      },
      { merge: true }
    );

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export default uploadImage;
