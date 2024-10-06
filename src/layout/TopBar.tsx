import * as React from "react";
import UploadStory from "./UploadStory";
import StoryContainer from "./StoryContainer";

interface ITopBarProps {}

const TopBar: React.FunctionComponent<ITopBarProps> = () => {
	return (
		<>
			<UploadStory />
			<StoryContainer />
		</>
	);
};

export default TopBar;
