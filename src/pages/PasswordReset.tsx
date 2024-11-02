import * as React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { NewUserPassword } from "@/types";
import { Button } from "@/components/ui/button";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import "@/components/reuseables/IconCircle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const initialValue: NewUserPassword = {
	email: ""
};

interface IPasswordResetProps {}

const PasswordReset: React.FunctionComponent<IPasswordResetProps> = () => {
	const [resetPassword, setResetPassword] =
		React.useState<NewUserPassword>(initialValue);

	const navigate = useNavigate();
	const handleSubmitPasswordReset = async (
		e: React.MouseEvent<HTMLFormElement>
	) => {
		e.preventDefault();

		const emailValue = resetPassword.email;
		sendPasswordResetEmail(auth, emailValue)
			.then((data) => {
				alert("check your email");

				navigate("/login");
			})
			.catch((err) => {
				alert(err.code);
			});
	};
	return (
		<div className="flex bg-white">
			<Card className="w-full h-screen">
				<form
					onSubmit={handleSubmitPasswordReset}
					className=" flex items-center justify-center flex-col h-4/5"
				>
					<CardHeader className="flex justify-center items-center">
						<CardTitle className="flex justify-center items-center flex-col">
							<div className="circle-icon-container">
								<FontAwesomeIcon icon={faLock} size="2x" />
							</div>
							<h1 className="text-3xl">Password reset</h1>
						</CardTitle>
						<CardDescription className="pb-8">
							<h3 className="font-semibold text-gray-700 w-80 leading-tight">
								Having trouble logging in? Enter your email we'll send you a
								link to get back into your account.
							</h3>
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 w-full sm:w-full md:w-1/2 lg:w-1/3">
						<div className="grid gap-2 w-full">
							<Label htmlFor="email">Email address</Label>
							<Input
								id="email"
								type="email"
								placeholder="jondoe@example.com"
								value={resetPassword.email}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setResetPassword({ ...resetPassword, email: e.target.value })
								}
							/>
						</div>
						<Link to="/login">
							<span className="text-gray-600 hover:text-gray-500 text-md font-semibold flex justify-end items-end">
								{" "}
								Back to Login
							</span>
						</Link>
					</CardContent>
					<CardFooter>
						<Button className="w-full">Confirm</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
};

export default PasswordReset;
