import * as React from "react";
import Story from "./Story";

interface IStoryContainerProps {}

const StoryContainer: React.FunctionComponent<IStoryContainerProps> = () => {
	return (
		<div>
			<Story />
		</div>
	);
};

export default StoryContainer;
