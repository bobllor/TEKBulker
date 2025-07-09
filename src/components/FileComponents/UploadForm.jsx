import { uploadFile } from "./utils"; 
import { useFileContext } from "../../context/FileContext";

export default function UploadForm({inputFileRef, FileUpload, showDrop}){
    const { uploadedFiles, setUploadedFiles } = useFileContext();

    return (
        <>
            <div className={`${showDrop ? "pointer-events-none opacity-0 z-0" : "z-2"} w-[50%] h-10
            flex flex-col justify-center items-center`}>
                <FileUpload inputFileRef={inputFileRef}/>
                {uploadedFiles.length > 0 && uploadedFiles.map((file, i) => (
                    <div
                    className="flex"
                    key={i}>
                        {file.name}
                    </div>
                ))}
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