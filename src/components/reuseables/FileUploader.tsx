import { useState } from "react";
import { FileEntry } from "@/types";
import {
  FileUploaderRegular,
  OutputFileEntry,
} from "@uploadcare/react-uploader";
import { uploadImage } from "../../firebase/firebaseStorage";

interface IFileUploaderProps {
  fileEntry: FileEntry;
  onChange: (fileEntry: FileEntry) => void;
  preview: boolean;
}

const FileUploader: React.FunctionComponent<IFileUploaderProps> = () => {
  const [files, setFiles] = useState<OutputFileEntry[]>([]);

  const handleFileUploadSuccess = (file: OutputFileEntry) => {
    setFiles((prevFiles) => [...prevFiles, file]);
  };
  return (
    <div>
      <FileUploaderRegular
        sourceList="local, url, camera"
        classNameUploader="uc-light uc-gray"
        pubkey="554f4def3f926b71fb61"
        imgOnly
        multiple={false}
        onFileUploadSuccess={handleFileUploadSuccess}
      />

      <div className="img-gallery">
        {files.map((file) => (
          <img key={file.uuid} src={file.cdnUrl as string} alt="Uploaded" />
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
