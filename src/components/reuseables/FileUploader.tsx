import { useState, useRef, useEffect, useCallback } from "react";
import { FileEntry } from "@/types";
import { FileUploaderRegular } from "@uploadcare/react-uploader";

interface IFileUploaderProps {
  fileEntry: FileEntry;
  onChange: (fileEntry: FileEntry) => void;
  preview: boolean;
}

const FileUploader: React.FunctionComponent<IFileUploaderProps> = (
  {
    // fileEntry,
    // onChange,
    // preview,
  }
) => {
  return (
    <div>
      <FileUploaderRegular
        sourceList="local, url, camera"
        classNameUploader="uc-light uc-gray"
        pubkey="554f4def3f926b71fb61"
      />
      {/* {preview ? (
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
      ) : (
        <></>
      )} */}
    </div>
  );
};

export default FileUploader;
