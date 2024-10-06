import { useState } from "react";
import * as React from "react";
import { storage, db } from "../firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

interface IUploadStoryProps {}

const UploadStory: React.FunctionComponent<IUploadStoryProps> = () => {
	const [file, setFile] = useState<File | null>(null);
	const { currentUser } = useUserAuth();

	const handleUploadStory = async () => {
		if (!file || !currentUser) return;

		const storageRef = ref(storage, `stories/${currentUser.uid}/${file.name}`);
		const snapshot = await uploadBytes(storageRef, file);
		const url = await getDownloadURL(snapshot.ref);

		await addDoc(collection(db, "stories"), {
			userId: currentUser.uid,
			url,
			createdAt: new Date()
		});
		setFile(null);
	};

	return (
		<div>
			<Button className="w-10 h-10 rounded-full">
				<Input
					id="file"
					type="file"
					onChange={(e) => setFile(e.target.files?.[0] || null)}
				/>
				+
			</Button>
		</div>
	);
};

export default UploadStory;
