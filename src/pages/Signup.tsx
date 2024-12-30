import * as React from "react";
("use client");
import { Icons } from "../components/ui/Icons";
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
import { UserSignUp } from "../types";
import { useUserAuth } from "../contexts/UserAuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import SmallSpinner from "@/components/reuseables/SmallSpinner";
import { FirebaseError } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

const initialValue: UserSignUp = {
  email: "",
  password: "",
  confirmPassword: "",
};

interface ISignupProps {}

const Signup: React.FunctionComponent<ISignupProps> = () => {
  const navigate = useNavigate();

  const { googleSignIn, signUp } = useUserAuth();
  const [userInfo, setUserInfo] = React.useState<UserSignUp>(initialValue);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    try {
      await googleSignIn();
      navigate("/create-username");
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    }
  };

  const handleFirebaseError = (err: FirebaseError): string => {
    switch (err.code) {
      case "auth/user-not-found":
        return "No user found with the provided credentials.";

      case "auth/wrong-password":
        return "The password you entered is incorrect.";

      case "auth/email-already-in-use":
        return "This email is already in use. Please use a different email.";

      case "auth/invalid-email":
        return "The email address is not valid. Please check and try again.";

      case "auth/weak-password":
        return "The password is too weak. Please use a stronger password.";

      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    const passwordValidationRegex = /^(?=.*[A-Z]).{6,}$/;
    if (!passwordValidationRegex.test(userInfo.password)) {
      setError(
        "Password must contain an uppercase letter and be at least 6 characters long."
      );
      return;
    }

    try {
      console.log(userInfo);

      await signUp(userInfo.email, userInfo.password);

      setLoading(true);
      setTimeout(() => {
        navigate("/create-username");
        setLoading(false);
      }, 5000);
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        const message = handleFirebaseError(err);
        console.log(message);
        setError(message);
      }
    }
  };
  return (
    <Card className="w-full h-screen">
      <form
        className="flex items-center justify-center flex-col h-4/5"
        onSubmit={handleSubmit}
      >
        <CardHeader className="space-y-1 flex justify-start ">
          <CardTitle className="text-2xl ">Snap 'n Share</CardTitle>
          <CardDescription className="xsm:leading-none ">
            Enter your email and password below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-grid gap-4 sm:w-2/3 md:w-1/2 lg:w-1/3 w-full">
          <Button variant="outline" onClick={handleGoogleSignIn}>
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          <div className="grid gap-2 w-full">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="jondoe@example.com"
              required
              value={userInfo.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="password"
              required
              value={userInfo.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUserInfo({ ...userInfo, password: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmpassword">Confirm password</Label>
            <Input
              id="confirmpassword"
              type="password"
              placeholder="Confirm password"
              required
              value={userInfo.confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUserInfo({ ...userInfo, confirmPassword: e.target.value })
              }
            />
          </div>
          {error && <p className="leading-4 text-red-500 ">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col justify-center items-center space-y-4">
          <Button className="w-full">
            {!loading ? (
              <motion.div
                whileHover={{ x: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span>next</span>
                <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
              </motion.div>
            ) : (
              <div>
                <SmallSpinner />
              </div>
            )}
          </Button>
          <p className="text-lg font-normal text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium 
							text-gray-900 hover:text-gray-700 cursor-pointer:hover dark:text-slate-300"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Signup;
