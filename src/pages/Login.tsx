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
import { UserLogIn } from "../types";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "@/contexts/UserAuthContext";
import SmallSpinner from "@/components/reuseables/SmallSpinner";

const initialValue: UserLogIn = {
  email: "",
  password: "",
};

interface ILoginProps {}

const Login: React.FunctionComponent<ILoginProps> = () => {
  const { googleSignIn, logIn } = useUserAuth();
  const navigate = useNavigate();
  const [userLogInInfo, setUserLogInInfo] =
    React.useState<UserLogIn>(initialValue);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    try {
      await googleSignIn();
      navigate("/");
    } catch (error) {
      console.log(error);
      // setError(error.message);
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log(userLogInInfo);
      if (!userLogInInfo.email || !userLogInInfo.password) {
        setError("oops no login info here");
      } else {
        await logIn(userLogInInfo.email, userLogInInfo.password);
        setLoading(true);
        setTimeout(() => {
          navigate("/");
          setLoading(false);
        }, 5000);
      }
    } catch (error: any) {
      if (error.code === "auth/invalid-email") {
        setError("Wrong email");
      } else {
        console.log(error.message);
      }
      console.log(error);

      if (error.code === "auth/invalid-credential") {
        setError("No user found");
      } else {
        console.log(error.message);
      }
    }
  };

  // PASSWORD RESET
  const handlePasswordReset = () => {
    navigate("/forgot-password");
  };
  return (
    <Card className="w-full h-screen">
      <form
        className=" flex items-center justify-center flex-col h-4/5"
        onSubmit={handleSubmit}
      >
        <CardHeader className="space-y-1 flex justify-start ">
          <CardTitle className="text-2xl ">Snap 'n Share</CardTitle>
          <CardDescription className="leading-none">
            Enter your email and password below to login
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
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
              value={userLogInInfo.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUserLogInInfo({ ...userLogInInfo, email: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="password"
              value={userLogInInfo.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUserLogInInfo({ ...userLogInInfo, password: e.target.value })
              }
            />
            {error && <p className="leading-4 text-red-500 ">{error}</p>}
          </div>
          <p
            onClick={handlePasswordReset}
            className="text-md font-medium text-slate-600 cursor-pointer hover:text-gray-900"
          >
            Forgot password?
          </p>
        </CardContent>
        <CardFooter className="flex flex-col justify-center items-center space-y-4">
          <Button className="w-full" type="submit">
            {!loading ? (
              <div>Login</div>
            ) : (
              <div>
                <SmallSpinner />
              </div>
            )}
          </Button>
          <p className="text-lg font-normal text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium 
							text-gray-900 hover:text-gray-700 cursor-pointer:hover"
            >
              Signup
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Login;
