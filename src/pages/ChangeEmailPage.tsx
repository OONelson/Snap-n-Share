import * as React from "react";
import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserProfile } from "@/contexts/UserProfileContext";
import SmallSpinner from "@/components/reuseables/SmallSpinner";
import { useToast } from "@chakra-ui/react";

interface IChangeEmailPageProps {}

const ChangeEmailPage: React.FunctionComponent<IChangeEmailPageProps> = () => {
  const [newEmail, setNewEmail] = useState<string>("");
  const [isChangingEmail, setIsChangingEmail] = useState<boolean>(false);

  const user = auth.currentUser;
  const { userProfile } = useUserProfile();

  const toast = useToast({
    position: "bottom",
    title: "Success!",
    description: "Email has been updated.",
    status: "success",
    duration: 2000,
    isClosable: true,
    colorScheme: "blackAlpha.900",

    containerStyle: {
      width: "200px",
      maxWidth: "100%",
      background: "blackAlpha.900",
    },
  });

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

      toast({
        containerStyle: {
          width: "200px",
          maxWidth: "100%",
          backgroundColor: "blackAlpha.900",
        },
      });
      setIsChangingEmail(false);

      console.log("final");
    } catch (error: any) {
      setIsChangingEmail(false);
      toast({
        title: "Error",
        description: "Failed to update email.",
        status: "error",
        duration: 2000,
        colorScheme: "red",
        isClosable: true,
        position: "bottom",
      });
      console.log("Error updating email:", error);
      setIsChangingEmail(false);
    }
  };

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
        <Button className="h-8" disabled onClick={() => handleEmailChange}>
          Update
        </Button>
      ) : (
        <Button className="h-8" onClick={() => handleEmailChange}>
          Update
        </Button>
      )}

      {isChangingEmail && <SmallSpinner />}
    </main>
  );
};

export default ChangeEmailPage;
