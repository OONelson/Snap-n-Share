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
	CardTitle
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { UserSignUp } from "../types";
import { useUserAuth } from "../contexts/UserAuthContext";
import { Link, useNavigate } from "react-router-dom";

const initialValue: UserSignUp = {
	email: "",
	password: "",
	confirmPassword: ""
};

interface ISignupProps {}

const Signup: React.FunctionComponent<ISignupProps> = () => {
	const { googleSignIn, signUp } = useUserAuth();
	const navigate = useNavigate();
	const [userInfo, setUserInfo] = React.useState<UserSignUp>(initialValue);

	const handleGoogleSignIn = async (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();

		try {
			await googleSignIn();
			navigate("/create-username");
		} catch (error) {
			console.log(error);
		}
	};
	const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			console.log(userInfo);

			await signUp(userInfo.email, userInfo.password);
			navigate("/create-username");
		} catch (error) {
			console.log(error);
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
							value={userInfo.password}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setUserInfo({ ...userInfo, confirmPassword: e.target.value })
							}
						/>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col justify-center items-center space-y-4">
					<Link to="/create-username">
						<Button className="w-full">Create account</Button>
					</Link>
					<p className="text-lg font-normal text-slate-600">
						Already have an account?{" "}
						<Link
							to="/login"
							className="font-medium 
							text-gray-900 hover:text-gray-700 cursor-pointer:hover"
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
