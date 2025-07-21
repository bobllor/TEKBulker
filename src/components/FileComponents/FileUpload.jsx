import { useFileContext } from "../../context/FileContext"
import AddFile from "../../svgs/AddFile";
import { onFileChange } from "./utils";

const defaultStyle = "py-5 px-10 rounded-xl bg-blue-500 text-white flex gap-1";
const filesUploadedStyle = "py-2 px-10 rounded-t-xl bg-blue-500 text-white flex gap-1";

export default function FileUpload({ inputFileRef, hasUploadedFiles = false }){
    const { setUploadedFiles } = useFileContext();

    return (
        <>
            <button
            className={`${!hasUploadedFiles ? defaultStyle : filesUploadedStyle}
                relative transition-all hover:bg-blue-400`}>
                <div
                className="flex justify-center items-center">
                    <AddFile />
                    <input className="opacity-0 absolute w-full h-full"
                    accept=".xlsx"
                    id="file-dialog"
                    ref={inputFileRef}
                    onChange={e => onFileChange(e, setUploadedFiles)}
                    type='file' />
                    <span>
                        Add File
                    </span>
                </div>
            </button>
        </>
    )
}