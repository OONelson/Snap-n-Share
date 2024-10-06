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
import { useNavigate } from "react-router-dom";

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
					<CardHeader className="space-y-1 ">
						<CardTitle>Password reset</CardTitle>
						<CardDescription>Enter a new password</CardDescription>
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
