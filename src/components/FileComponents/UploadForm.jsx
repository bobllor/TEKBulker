import { uploadFile } from "./utils"; 
import { useFileContext } from "../../context/FileContext";
import React from "react";
import FileEntry from "./FileEntry";

const widthStyle = "w-150";

export default function UploadForm({inputFileRef, FileUpload, showDrop}){
    const { uploadedFiles } = useFileContext();

    return (
        <>
            <div className={`${showDrop && "pointer-events-none opacity-0 z-0"} w-[50%]
            flex flex-col justify-center items-center`}>
                <>
                    {uploadedFiles.length > 0 &&
                    <div className={`flex justify-start ${widthStyle} px-5`}>
                        <FileUpload inputFileRef={inputFileRef} hasUploadedFiles={true}/>
                    </div>
                    }
                    <div className={`border-1 h-80 ${widthStyle} p-3 rounded-xl flex flex-col items-center
                    ${uploadedFiles != 0 ? "overflow-y-scroll scroll-style" : "justify-center"}
                    ${!showDrop && "z-2"}`}>
                        {uploadedFiles.length == 0 && <FileUpload inputFileRef={inputFileRef} />}
                        <>
                          {uploadedFiles.map((file, i) => (
                              <React.Fragment key={i}>
                                  <FileEntry file={file} />
                              </React.Fragment>
                          ))}
                        </>
                    </div>
                </>
                <form 
                className={`flex flex-col justify-center items-center gap-3 p-5 ${!showDrop && "z-5"}`}
                onSubmit={(e) => uploadFile(e, uploadedFiles)}>
                    <div>
                        <button
                        className={`px-10 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-400`}
                        type='submit'>Submit</button>
                    </div>
                </form>
            </div>
        </>
    )
}