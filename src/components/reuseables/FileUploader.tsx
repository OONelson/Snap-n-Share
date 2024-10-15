import * as React from "react";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";

interface IFileUplaoderProps {}

const FileUplaoder: React.FunctionComponent<IFileUplaoderProps> = () => {
	return (
		<div>
			<FileUploaderRegular
				sourceList="local, url, camera"
				classNameUploader="uc-light uc-white"
				pubkey="b5195a441b3832d8a02a"
				className="py-2 text-center w-40 bg-gray-200 rounded-sm"
			/>
		</div>
	);
};

export default FileUplaoder;
