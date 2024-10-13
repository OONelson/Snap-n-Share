import FileUplaoder from "@/components/reuseables/FileUploader";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	// CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import SideBar from "@/layout/SideBar";

interface ICreatePostProps {}

const CreatePost: React.FunctionComponent<ICreatePostProps> = () => {
	return (
		<div className="flex">
			<SideBar />
			<Card className="flex justify-center items-center flex-col h-screen w-4/5 border-none">
				<CardHeader>
					<CardTitle>Time to snap and share</CardTitle>
				</CardHeader>
				<CardContent>
					<FileUplaoder />
				</CardContent>
			</Card>
		</div>
	);
};

export default CreatePost;
