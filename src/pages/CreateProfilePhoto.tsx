import * as React from "react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
// import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowRight,
	faPlus,
	faFileAlt,
	faCameraAlt,
} from "@fortawesome/free-solid-svg-icons";
import SmallModal from "@/components/reuseables/SmallModal";
import { useNavigate } from "react-router-dom";

interface ICreateProfilePhotoProps {}

const CreateProfilePhoto: React.FunctionComponent<
	ICreateProfilePhotoProps
> = () => {
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);

	const toggleModal = () => {
		setShowModal((prev) => !prev);
	};

	const handleOpenCamera = () => {
		navigate("/camera");
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
					</CardContent>
					<CardFooter className="flex flex-col justify-center items-center space-y-4">
						<Button disabled className="w-full px-4">
							<span className="px-2">Next</span>
							<FontAwesomeIcon icon={faArrowRight} />
						</Button>
					</CardFooter>
				</form>
			</Card>

			<SmallModal show={showModal} onClose={toggleModal}>
				<div
					// onClick={handleOpenCamera}
					className="mb-3 mt-3 py-1 text-xl cursor-pointer rounded-sm hover:bg-slate-300"
				>
					<span className="px-2">Camera</span>
					<FontAwesomeIcon icon={faCameraAlt} />
				</div>
				<div className="text-xl py-1 rounded-sm hover:bg-slate-300">
					<span className="px-2">File</span>
					<FontAwesomeIcon icon={faFileAlt} />
				</div>
			</SmallModal>
		</>
	);
};

export default CreateProfilePhoto;
