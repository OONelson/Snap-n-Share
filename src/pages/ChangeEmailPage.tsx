import { auth, db } from "@/firebase/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  Flex,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import * as React from "react";
import { useEffect, useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

interface IChangeEmailPageProps {
  confirmationLength: number;
  onCodeChange: (confirmation: string) => void;
}

const ChangeEmailPage: React.FunctionComponent<IChangeEmailPageProps> = ({
  confirmationLength,
  onCodeChange,
}) => {
  const [newEmail, setNewEmail] = useState<string>("");
  const [isChanging, setIsChangingEmail] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState("");
  const [isConfirmationSent, setIsConfirmationSent] = useState<boolean>(false);
  const [error, setError] = useState("");

  const user = auth.currentUser;

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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmail(e.target.value);
  };

  //   const handleConfirmationChange = async (
  //     e: React.ChangeEvent<HTMLInputElement>
  //   ) => {
  //     e.preventDefault();
  //     setConfirmation(e.target.value);
  //   };

  const handleChange = (index: number, value: string) => {
    const newCode =
      confirmation.substring(0, index) +
      value +
      confirmation.substring(index + 1);
    setConfirmation(newCode);
    onCodeChange(newCode);
  };

  const handleSendEmailConfirmation = async () => {
    const functions = getFunctions();
    const sendEmail = httpsCallable(functions, "sendEmailVerification");
    try {
      const generatedCode = uuidv4();

      setIsConfirmationSent(true);
      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          emailConfirmationCode: generatedCode,
        });
      }

      await sendEmail({
        email: auth.currentUser?.email || "",
        code: generatedCode,
      });
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      console.log("Error sending confirmation email:", error);

      setError("Failed to send confirmation email. Please try again.");
    }
  };

  return (
    <main>
      {isConfirmationSent ? (
        // <form onSubmit={handleConfirmationChange}>
        <Flex>
          {Array.from({ length: confirmationLength }).map((_, index) => (
            <Box
              key={index}
              mx={2}
              w="2rem"
              h="2rem"
              borderWidth="1px"
              borderRadius="md"
            >
              <InputGroup size="sm">
                <InputLeftElement
                  pointerEvents="none"
                  children={<Text fontSize="sm">{index + 1}</Text>}
                />
                <Input
                  type="text"
                  maxLength={1}
                  value={confirmation[index] || ""}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && index > 0) {
                      handleChange(index - 1, "");
                    }
                    if (e.key.length === 1 && e.key >= "0" && e.key <= "9") {
                      handleChange(index + 1, "");
                    }
                  }}
                />
              </InputGroup>
            </Box>
          ))}
        </Flex>
      ) : (
        // </form>
        <div className="w-[300px] flex justify-center items-center">
          <span className="underline font-light">{user?.email}</span>
          <Button onClick={handleSendEmailConfirmation} className="h-9 ">
            send code
          </Button>
        </div>
      )}
    </main>
  );
};

export default ChangeEmailPage;
