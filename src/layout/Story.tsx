import * as React from "react";

interface IStoryProps {}

const Story: React.FunctionComponent<IStoryProps> = () => {
	return (
		<div>
			<div className="w-20 h-20 rounded-full border-red-700 border-4 border-solid "></div>
		</div>
	);
};

export default Story;
