import { useFileContext } from "../../context/FileContext"
import AddFile from "../../svgs/AddFile";

export default function FileUpload({ inputFileRef }){
    const { setUploadedFiles } = useFileContext();

    const onFileChange = (event) => {
        setUploadedFiles(prev => [...prev, event.target.files[0]]);
    }

    return (
        <>
            <button
            className="py-5 px-10 rounded-xl bg-blue-500 text-white flex gap-1 relative transition-all hover:bg-blue-400">
                <div
                className="flex justify-center items-center">
                    <AddFile />
                    <input className="opacity-0 absolute w-full h-full"
                    accept=".xlsx"
                    id="file-dialog"
                    ref={inputFileRef}
                    onChange={onFileChange}
                    type='file' />
                    <span>
                        Add File
                    </span>
                </div>
            </button>
        </>
    )
}