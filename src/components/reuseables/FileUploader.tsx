import * as React from "react";
import { FileUploaderRegular, OutputFileEntry } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import { FileEntry } from "@/types";

interface IFileUplaoderProps {
	fileEntry: FileEntry,
	onChange: (fileEntry: FileEntry)=> void;
}

const FileUplaoder: React.FunctionComponent<IFileUplaoderProps> = ({fileEntry, onChange}) => {
	

	// const handleRemoveClick = React.useCallback(
  //   (uuid: OutputFileEntry["uuid"]) =>
  //     onChange({ files: fileEntry.files.filter((f) => f.uuid !== uuid) }),
  //   [fileEntry.files, onChange]
  // );
	
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

			<div className="grid grid-cols-2 gap-4 mt-8">
        {fileEntry.files.map((file) => (
          <div key={file.uuid} className="relative">
            <img
              key={file.uuid}
              src={`${file.cdnUrl}/-/format/webp/-/quality/smart/-/stretch/fill/
              `}
            />

            <div className="cursor-pointer flex justify-center absolute -right-2 -top-2 bg-white border-2 border-slate-800  rounded-full w-7 h-7">
              <button
                className="text-slate-800 text-center"
                type="button"
                onClick={() => handleRemoveClick(file.uuid)}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

		</div>
	);
};

export default FileUplaoder;
