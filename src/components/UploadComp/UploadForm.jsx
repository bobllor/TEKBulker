import { uploadFile } from "./utils"; 

export default function UploadForm({inputFileRef}){
    return (
        <>
            <div className="border-1 w-[50%]">
                <form 
                className="flex flex-col justify-center items-center gap-3"
                onSubmit={(e) => uploadFile(e, inputFileRef)}>
                    <label className="relative" htmlFor="file-dialog">
                        <input className="opacity-0 absolute w-full h-[inherit]"
                        id="file-dialog"
                        ref={inputFileRef}
                        type='file' />
                        Choose a file or drag & drop
                    </label>
                    <div>
                        <button
                        type='submit'>Submit</button>
                    </div>
                </form>
            </div>
        </>
    )
}