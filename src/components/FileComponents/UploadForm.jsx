import { uploadFile } from "./utils"; 
import { useFileContext } from "../../context/FileContext";
import React from "react";
import FileEntry from "./FileEntry";

export default function UploadForm({inputFileRef, FileUpload, showDrop}){
    const { uploadedFiles } = useFileContext();

    return (
        <>
            <div className={`${showDrop ? "pointer-events-none opacity-0 z-0" : "z-2"} w-[50%]
            flex flex-col justify-center items-center`}>
                {uploadedFiles.length == 0 ? <FileUpload inputFileRef={inputFileRef}/> :
                <>
                    <div className="flex justify-start w-full">
                        <FileUpload inputFileRef={inputFileRef} hasUploadedFiles={true}/>
                    </div>
                    <div className="border-1 h-50 w-120 p-3 overflow-y-scroll">
                        {uploadedFiles.map((file, i) => (
                            <React.Fragment key={i}>
                                <FileEntry file={file} />
                            </React.Fragment>
                        ))}
                    </div>
                </>
                }
                <form 
                className="flex flex-col justify-center items-center gap-3"
                onSubmit={(e) => uploadFile(e, uploadedFiles)}>
                    {uploadedFiles.length > 0 &&
                    <div>
                        <button
                        type='submit'>Submit</button>
                    </div>
                    }
                </form>
            </div>
        </>
    )
}