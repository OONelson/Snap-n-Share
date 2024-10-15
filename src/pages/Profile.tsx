import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	// CardFooter,
	// CardHeader,
	CardTitle
} from "../components/ui/card";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import SideBar from "@/layout/SideBar";
import { useUsername } from "@/contexts/UsernameContext";
import { useUserProfilePhoto } from "@/contexts/UserProfilePhoto";
import { useUserAuth } from "@/contexts/UserAuthContext";

interface IProfileProps {}

const Profile: React.FunctionComponent<IProfileProps> = () => {
	const { username } = useUsername();
	const { capturedImage } = useUserProfilePhoto();
	const { logOut } = useUserAuth();
	// const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
	// null
	// );

	// useEffect(() => {
	// 	const fetchProfilePicture = async () => {
	// 		const userImageDocRef = doc(db, "profilephoto", userID);
	// 		const docSnapshot = await getDoc(userImageDocRef);

	// 		if (docSnapshot.exists()) {
	// 			const userData = docSnapshot.data();
	// 			if (userData) {
	// 				setProfilePictureUrl(userData);
	// 			}
	// 		}
	// 	};
	// });

	return (
		<main className="flex h-full">
			<SideBar />
			<Card className="flex flex-col w-5/6 border-none">
				{/* <CardHeader>
					<CardTitle>

					</CardTitle>
				</CardHeader> */}
				<div className="flex justify-end items-center pt-2">
					<Button className=" w-20" onClick={logOut}>
						{" "}
						logout
					</Button>
				</div>
				<CardContent className="pt-10">
					<section className="flex flex-row justify-center items-center w-4/5">
						<picture className="pr-5">
							<img
								src={capturedImage}
								alt="profilephoto"
								className="h-32 w-32 rounded-full"
							/>
						</picture>

						<div>
							<div className="flex items-center justify-between w-80">
								<CardTitle>{username}</CardTitle>
								<p className="text-lg font-normal">
									<span>0</span>
									Posts
								</p>
								<Button>Edit profile</Button>
							</div>

							<div>
								<CardDescription>
									<h2>NAme</h2>
									<p>bio</p>
								</CardDescription>
							</div>
						</div>
					</section>

					<section className="flex justify-center items-center mt-20">
						<div>posts</div>
					</section>
				</CardContent>
			</Card>
		</main>
	);
};

export default Profile;
