import * as React from "react";
import { useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { storage, db } from "@/firebase/firebaseConfig";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowRight,
	faPlus,
	faFileAlt,
	faCameraAlt,
	faTimes
} from "@fortawesome/free-solid-svg-icons";
import SmallModal from "@/components/reuseables/SmallModal";
import BigModal from "@/components/reuseables/BigModal";
import "@/components/reuseables/ProgressBar.css";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, spring } from "framer-motion";
import { useUserProfilePhoto } from "@/contexts/UserProfilePhoto";
import { useUserAuth } from "@/contexts/UserAuthContext";

interface ICreateProfilePhotoProps {}

const CreateProfilePhoto: React.FunctionComponent<
	ICreateProfilePhotoProps
> = () => {
	const { capturedImage, setCapturedImage } = useUserProfilePhoto();
	const { user } = useUserAuth();

	const navigate = useNavigate();

	const [showModal, setShowModal] = useState(false);
	const [showBigModal, setShowBigModal] = useState(false);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const [streaming, setStreaming] = useState<boolean>(false);

	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [progress, setProgress] = useState<number>(0);

	const toggleModal = () => {
		setShowModal((prev) => !prev);
	};

	const toggleBigModal = () => {
		setShowBigModal((prev) => !prev);
	};
	const toggleCancelPreview = () => {
		setCapturedImage(null);
		setSelectedImage(null);
	};

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

	const captureImage = () => {
		if (videoRef.current) {
			const canvas = document.createElement("canvas");
			const context = canvas.getContext("2d");
			if (!context) return null;

			canvas.width = videoRef.current.videoWidth;
			canvas.height = videoRef.current.videoHeight;
			context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
			const dataUrl = canvas.toDataURL("image/png");
			setCapturedImage(dataUrl);
			setShowBigModal(false);
			setShowModal(false);
			stopCamera();
		} else {
			alert("take a selfie");
			setCapturedImage(null);
		}
	};

	const handleFileSelect = (file: File) => {
		setSelectedImage(file);
		const reader = new FileReader();
		reader.onloadend = () => {
			setCapturedImage(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleFileButtonClick = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.onchange = (e: any) => {
			const file = e.target.files[0];
			if (file) {
				handleFileSelect(file);
			}
		};
		input.click();
		setShowModal(false);
	};

	const uploadToFirebase = async (userId:string, capturedImage:string) => {
		// e.preventDefault();

		if (!capturedImage) return;

		const blob = await fetch(capturedImage).then((res) => res.blob());
		const storageRef = ref(storage, `profilephoto/${user?.uid}.png`);
		const uploadTask = uploadBytesResumable(storageRef, blob);

		await setDoc(doc(db, "profilephoto", userId), {
			profilePicture: captureImage,
			timestamp: new Date()
		});

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;

				setProgress(progress);
			},
			(error) => {
				console.error("Upload failed:", error);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					console.log("File available at", downloadURL);

					setProgress(0);
					setCapturedImage(downloadURL);
					// setSelectedImage(downloadURL);
					alert("Image uploaded successfully!");

					navigate("/");
				});
			}
		);
	};

	return (
		<>
			<Card className="w-full h-screen flex items-end justify-center flex-col ">
				<Button className=" px-4"> Skip </Button>
				<form className="flex items-center  justify-center flex-col h-4/5 w-full">
					<CardHeader className="space-y-1 flex justify-center items-start  ">
						<CardTitle className="text-2xl ">Select a profile photo</CardTitle>
						<CardDescription className="pb-10">
							Profile photos add swag and steeze.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-grid gap-4 sm:w-2/3 md:w-1/2 lg:w-1/3 w-full">
						{!capturedImage ? (
							<>
								<Label htmlFor="username" className="space-y-1">
									Click to select a photo
								</Label>
								<div
									onClick={toggleModal}
									className=" flex justify-center items-center bg-stone-200 py-20 cursor-pointer"
								>
									<FontAwesomeIcon
										className=" text-2xl bg-stone-200 "
										icon={faPlus}
									/>{" "}
								</div>
							</>
						) : (
							<>
								<Label htmlFor="username" className="space-y-1">
									Upload Selfie to save it.
								</Label>
								<div className="flex flex-col justify-end items-end">
									<FontAwesomeIcon
										icon={faTimes}
										onClick={toggleCancelPreview}
										className=" cursor-pointer flex justify-right items-right"
									/>

									<img
										src={capturedImage}
										alt="Selected"
										className="h-auto w-auto my-3"
									/>
									{!progress ? (
										<Button
											className="bg-green-600 hover:bg-green-500"
											onClick={uploadToFirebase}
										>
											Upload image
										</Button>
									) : (
										<Button
											className="hidden bg-green-600 hover:bg-green-500"
											onClick={uploadToFirebase}
										>
											Upload image
										</Button>
									)}
								</div>
							</>
						)}

						{progress > 0 && (
							<div className="flex flex-col">
								<progress value={progress} max="100" className="progress" />
								<span className="font-bold text-md">
									{" "}
									{progress.toFixed(0)}%
								</span>
							</div>
						)}
					</CardContent>
					<CardFooter className="flex flex-col justify-center items-center space-y-4 mb-10">
						{progress === 100 ? (
							<Link to="/">
								<Button className="w-full px-4">
									<span className="px-2">Next</span>
									<FontAwesomeIcon icon={faArrowRight} />
								</Button>
							</Link>
						) : (
							<Button disabled className="w-full px-4">
								<span className="px-2">Next</span>
								<FontAwesomeIcon icon={faArrowRight} />
							</Button>
						)}
					</CardFooter>
				</form>
			</Card>

			<SmallModal show={showModal} onClose={toggleModal}>
				<div
					onClick={toggleBigModal}
					className="mb-3 mt-3 py-1 text-xl cursor-pointer rounded-sm hover:bg-slate-300"
				>
					<span className="px-2">Camera</span>
					<FontAwesomeIcon icon={faCameraAlt} />
				</div>
				<div
					onClick={handleFileButtonClick}
					className="text-xl py-1 cursor-pointer rounded-sm hover:bg-slate-300"
				>
					<span className="px-2">File</span>
					<FontAwesomeIcon icon={faFileAlt} />
				</div>
			</SmallModal>

			<BigModal show={showBigModal} onClose={toggleBigModal}>
				<Card>
					<CardHeader>
						<CardTitle>Ready for a selfie?</CardTitle>
						<CardDescription>
							A profile photo helps other users to recognize you easily.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<video ref={videoRef} className="w-[100] h-auto" />
					</CardContent>
					<CardFooter>
						<div className="px-2">
							{!streaming ? (
								<Button onClick={startCamera}>
									<FontAwesomeIcon icon={faCameraAlt} />
								</Button>
							) : (
								<Button
									className="bg-red-600 hover:bg-red-500"
									onClick={stopCamera}
								>
									Stop Camera
								</Button>
							)}
						</div>
						{!streaming ? (
							<Button disabled onClick={captureImage}>
								Capture
							</Button>
						) : (
							<Button onClick={captureImage}>Capture</Button>
						)}
					</CardFooter>
				</Card>
			</BigModal>
		</>
	);
};

export default CreateProfilePhoto;
