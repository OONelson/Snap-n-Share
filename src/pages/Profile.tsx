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
			<Card className="w-4/5 border-none">
				{/* <CardHeader>
					<CardTitle>

					</CardTitle>
				</CardHeader> */}
				<Button onClick={logOut}> logout</Button>
				<CardContent>
					<section>
						<picture>
							<img src={capturedImage} alt="profilephoto" />
						</picture>

						<div>
							<CardTitle>{username}</CardTitle>
							<p>
								<span>0</span>
								Posts
							</p>
							<Button>Edit profile</Button>
						</div>

						<div>
							<CardDescription>Name</CardDescription>
							<p>bio</p>
						</div>
					</section>

					<section>
						<div>posts</div>
					</section>
				</CardContent>
			</Card>
		</main>
	);
};

export default Profile;
