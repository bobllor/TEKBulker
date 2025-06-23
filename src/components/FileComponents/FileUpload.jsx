import { useFileContext } from "../../context/FileContext"
import AddFile from "../../svgs/AddFile";

export default function FileUpload({ inputFileRef }){
    const { setUploadedFile } = useFileContext();

    const onFileChange = (event) => {
        setUploadedFile(prev => [...prev, event.target.files[0]]);
    }

    return (
        <>
            <button
            className="py-5 px-10 rounded-xl bg-blue-500 text-white flex gap-1">
                <AddFile />
                <label className="relative z-0" htmlFor="file-dialog">
                    <input className="opacity-0 absolute w-full h-[inherit]"
                    accept=".xlsx"
                    id="file-dialog"
                    ref={inputFileRef}
                    onChange={onFileChange}
                    type='file' />
                    Add File
                </label>
            </button>
        </>
    )
}