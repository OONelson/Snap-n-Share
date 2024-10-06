import * as React from "react";
import { useState } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { UserName } from "@/types";
import { useNavigate } from "react-router-dom";
import { db } from "@/firebase/firebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import SmallSpinner from "@/components/reuseables/SmallSpinner";

const initialValue: UserName = {
	displayName: ""
};

interface ICreateUsernameProps {}

const CreateUsername: React.FunctionComponent<ICreateUsernameProps> = () => {
	const navigate = useNavigate();

	const [username, setUsername] = React.useState<UserName>(initialValue);
	const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
	const [loading, setLoading] = useState(false);

	const checkUsername = async () => {
		setLoading(true);

		const usersRef = collection(db, "users");
		const q = query(usersRef, where("username", "==", username));
		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			setIsAvailable(true);

			addDoc(collection(db, "users"), {
				// uid: user.uid,
				username: username
			});
		} else {
			setIsAvailable(false);
		}

		setLoading(false);
	};

	const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			console.log(username);
			await checkUsername();

			if (isAvailable) {
				console.log("Username is available!");

				navigate("/create-profilephoto");
			} else {
				console.log("Username is already taken.");
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Card className="w-full h-screen flex items-center justify-center ">
			<form
				onSubmit={handleSubmit}
				className="flex items-center  justify-center flex-col h-4/5 w-full"
			>
				<CardHeader className="space-y-1 flex justify-center items-start  ">
					<CardTitle className="text-2xl ">Get yourself a Username</CardTitle>
					<CardDescription className="pb-10">
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
						value={username.displayName}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setUsername({ ...username, displayName: e.target.value })
						}
					/>

					<div className="-mt-2">
						{loading && <p className="text-md">Checking...</p>}
						{isAvailable === true && (
							<p className="text-lime-500 text-md font-medium">
								Username is available!
							</p>
						)}
						{isAvailable === false && (
							<p className="text-red-600 text-md font-medium">
								Username is already taken.
							</p>
						)}
					</div>
				</CardContent>

				<CardFooter className="flex flex-col justify-center items-center space-y-4">
					{loading && (
						<Button disabled className="w-full px-4">
							<span className="px-2">Next</span>
							<div>
								{loading && <SmallSpinner></SmallSpinner>}
								{!loading && <FontAwesomeIcon icon={faArrowRight} />}
							</div>
						</Button>
					)}

					{!loading && (
						<Button className="w-full px-4">
							<span className="px-2">Next</span>
							<div>
								{loading && <SmallSpinner></SmallSpinner>}
								{!loading && <FontAwesomeIcon icon={faArrowRight} />}
							</div>
						</Button>
					)}
				</CardFooter>
			</form>
		</Card>
	);
};

export default CreateUsername;
