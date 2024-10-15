import FileUplaoder from "@/components/reuseables/FileUploader";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	// CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SideBar from "@/layout/SideBar";

interface ICreatePostProps {}

const CreatePost: React.FunctionComponent<ICreatePostProps> = () => {
	return (
		<div>
			<SideBar />
			<form className="flex justify-center items-center flex-col h-screen w-full  border-none">
				<Card className="sm:w-2/5 w-4/5 ">
					<CardHeader>
						<CardTitle>Time to snap and share</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<Label>Snap caption</Label>
						<Textarea
							className="my-5"
							id="caption"
							placeholder="what's in your snap"
						/>
						<FileUplaoder />
					</CardContent>
					<CardFooter className="flex justify-center items-center">
						<Button className="px-8" type="submit">
							Post
						</Button>
					</CardFooter>
				</Card>
			</form>
		</div>
	);
};

export default CreatePost;
