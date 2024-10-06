import * as React from "react";
import { useRef, useState } from "react";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { storage } from "@/firebase/firebaseConfig";
import { db } from "@/firebase/firebaseConfig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';


interface IuseCameraProps {}

const useCamera: React.FunctionComponent<IuseCameraProps> = () => {
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const [streaming, setStreaming] = useState<boolean>(false);

	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: false
			});
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				videoRef.current.play();
			}
			setStreaming(true);
		} catch (error) {
			console.error("Error Accessing the camera:", error);
		}
	};

	const stopCamera = () => {
		if (videoRef.current && videoRef.current.srcObject) {
			const stream = videoRef.current.srcObject as MediaStream;
			stream.getTracks().forEach((track) => track.stop());
			videoRef.current.srcObject = null;
		}
		setStreaming(false);
	};

	const captureImage = (): string | null => {
		if (videoRef.current) {
			const canvas = document.createElement("canvas");
			const context = canvas.getContext("2d");
			if (!context) return null;

			canvas.width = videoRef.current.videoWidth;
			canvas.height = videoRef.current.videoHeight;
			context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
			return canvas.toDataURL("image/png");
		}
		return null;
	};

	const uploadToFirebase = async (imageData: string) => {
		try {
			const storageRef = ref(storage, `images/${Date.now()}.png`);
			const snapshot = await uploadString(storageRef, imageData, "data_url");
			const downloadURL = await getDownloadURL(snapshot.ref);

			await addDoc(collection(db, "images"), {
				url: downloadURL,
				timestamp: new Date()
			});

			alert("Image uploaded and metadata saved!");
		} catch (error) {
			console.error("Error uploading image:", error);
		}
	};

	return (
		<div>
			<video ref={videoRef} className="w-[100] h-auto" />
			{!streaming ? (
				<button onClick={startCamera}>
<FontAwesomeIcon icon={faCamera}/>
</button>
			) : (
				<button onClick={stopCamera}>Stop Camera</button>
			)}
			<button
				onClick={() => {
					const imageData = captureImage();
					if (imageData) {
						uploadToFirebase(imageData);
					}
				}}
			>
				Capture and Upload
			</button>
		</div>
	);
};

export default useCamera;
