import * as React from "react";
import { FileUploaderRegular, OutputFileEntry } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import { FileEntry } from "@/types";

interface IFileUplaoderProps {
	fileEntry: FileEntry,
	onChange: (fileEntry: FileEntry)=> void;
}

const FileUplaoder: React.FunctionComponent<IFileUplaoderProps> = ({fileEntry, onChange}) => {
	// const [uploadFiles, setUploadFiles]= React.useState<OutputFileEntry[]>([]);
	// const ctxProviderRef= React.useRef<typeof Lr


	return (
		<div>
			<FileUploaderRegular
				sourceList="local, url, camera"
				classNameUploader="uc-light uc-white"
				pubkey="b5195a441b3832d8a02a"
				imgOnly={true}
				multiple={true}
				className="py-2 text-center w-40 bg-gray-200 rounded-sm"
			/>
		</div>
	);
};

export default FileUplaoder;
