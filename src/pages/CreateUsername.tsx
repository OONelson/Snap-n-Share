import * as React from "react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import SmallSpinner from "@/components/reuseables/SmallSpinner";
import UserIcon from "@/components/assets/account-hover-account.svg";
import { motion } from "framer-motion";
import { useUsername } from "@/contexts/UsernameContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { UserProfileInfo } from "@/types";

interface ICreateUsernameProps {}

const CreateUsername: React.FunctionComponent<ICreateUsernameProps> = () => {
  const navigate = useNavigate();
  // DECLARATIONS/ASSIGNMENTS
  // const {user} = useUserAuth()
  const {
    username,
    setUsername,
    loading,
    isAvailable,
    handleCheckUsername,
    error,
    setIsAvailable,
    setError,
  } = useUsername();
  const [userProfile, setUserProfile] = useState<UserProfileInfo | null>(null);

  const handleCreateUsername =
    async (e: React.MouseEvent<HTMLButtonElement>) =>
    async (uid: string, username: string) => {
      e.preventDefault();
      // handleCheckUsername();

      await setDoc(doc(db, "usernames", uid), {
        uid: userProfile?.uid,
        username: username,
        timestamp: new Date(),
      });

      navigate("/create-profilephoto");
    };
  return (
    <Card className="w-full h-screen flex items-center justify-center ">
      <div className="flex items-center  justify-center flex-col h-4/5 w-full">
        <CardHeader className="space-y-0 flex justify-center items-center  ">
          <div>
            <img src={UserIcon} alt="userIcon" className="h-20 w-20 mb-6" />
          </div>
          <CardTitle className="text-2xl ">Get yourself a Username</CardTitle>
          <CardDescription className="pb-5 font-medium xsm:font-light">
            maybe something fancy or unique.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-grid gap-4 sm:w-2/3 md:w-1/2 lg:w-1/3 w-full">
          <Label htmlFor="username" className="space-y-1 text-md -mb-2">
            Type out a Username
          </Label>
          <Input
            type="text"
            placeholder="Enter a username"
            required
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUsername(e.target.value);
              setIsAvailable(null);
              setError(null);
            }}
          />

          <div className="-mt-2">
            {isAvailable === true && (
              <p className="text-lime-500 text-base sm:font-medium">
                Username is available!
              </p>
            )}
            {isAvailable === false && (
              <p className="text-red-600 text-base sm:font-medium">
                Username is already taken.
              </p>
            )}
            {error && (
              <span className="text-red-600 text-base sm:font-medium">
                {error}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col justify-center items-center space-y-4">
          {isAvailable && (
            <Button onClick={handleCreateUsername} className="w-full px-4">
              <motion.div
                whileHover={{ x: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {}
                <span className="px-2 ">next</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </motion.div>
            </Button>
          )}

          {!loading && !isAvailable && (
            <Button onClick={handleCheckUsername} className="w-full px-4">
              <span className="px-2">check</span>
            </Button>
          )}
          <div>{loading && <SmallSpinner />}</div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default CreateUsername;
