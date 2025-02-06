import * as React from "react";
import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserProfile } from "@/contexts/UserProfileContext";
import SmallSpinner from "@/components/reuseables/SmallSpinner";

interface IChangeEmailPageProps {}

const ChangeEmailPage: React.FunctionComponent<IChangeEmailPageProps> = () => {
  const [newEmail, setNewEmail] = useState<string>("");
  const [isChangingEmail, setIsChangingEmail] = useState<boolean>(false);

  const user = auth.currentUser;
  const { userProfile } = useUserProfile();
  useEffect(() => {
    if (user) {
      const userRef = doc(db, "users", user.uid);

      const getUserData = async () => {
        try {
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            // Access user data here:
            console.log("User data:", docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error getting user document:", error);
        }
      };

      getUserData();
    }
  }, [user]);

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChangingEmail(true);

    setNewEmail(e.target.value);
    console.log("initial");

    if (!emailRegex.test(newEmail)) {
      console.log("invalid email format");
      return;
    }

    setNewEmail(e.target.value);
    console.log("initial");
    try {
      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          email: newEmail,
        });
      }
      setIsChangingEmail(false);

      console.log("final");
    } catch (error: any) {
      setIsChangingEmail(false);

      console.log("Error updating email:", error);
      setIsChangingEmail(false);
    }
  };

  //   const handleConfirmationChange = async (
  //     e: React.ChangeEvent<HTMLInputElement>
  //   ) => {
  //     e.preventDefault();
  //     setConfirmation(e.target.value);
  //   };

  // const handleChange = (index: number, value: string) => {
  //   const newCode =
  //     confirmation.substring(0, index) +
  //     value +
  //     confirmation.substring(index + 1);
  //   setConfirmation(newCode);
  //   onCodeChange(newCode);
  // };

  // const handleSendEmailConfirmation = async () => {
  //   const functions = getFunctions();
  //   const sendEmail = httpsCallable(functions, "sendEmailVerification");
  //   try {
  //     const generatedCode = uuidv4();

  //     setIsConfirmationSent(true);
  //     if (user) {
  //       await updateDoc(doc(db, "users", user.uid), {
  //         emailConfirmationCode: generatedCode,
  //       });
  //     }

  //     await sendEmail({
  //       email: auth.currentUser?.email || "",
  //       code: generatedCode,
  //     });
  //   } catch (error) {
  //     console.error("Error sending confirmation email:", error);
  //     console.log("Error sending confirmation email:", error);

  //     setError("Failed to send confirmation email. Please try again.");
  //   }
  // };

  return (
    <main className="w-[300px] space-y-2  px-2">
      <span className="font-light underline">{userProfile?.email}</span>
      <Input
        className="w-[250px]"
        placeholder="new email"
        value={newEmail}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNewEmail(e.target.value)
        }
      />

      {isChangingEmail ? (
        <Button className="h-8" disabled onClick={handleEmailChange}>
          Update
        </Button>
      ) : (
        <Button className="h-8" onClick={handleEmailChange}>
          Update
        </Button>
      )}

      {isChangingEmail && <SmallSpinner />}
    </main>
  );
};

export default ChangeEmailPage;
