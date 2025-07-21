import { JSX } from "react";
import Trash from "../../svgs/Trash";
import { useFileContext } from "../../context/FileContext";
import { UploadedFilesProps } from "./utils/types";
import { deleteFileEntry } from "./utils";

export default function FileEntry({file}: {file: UploadedFilesProps}): JSX.Element{
    const { setUploadedFiles } = useFileContext();

    return (
        <>
            <div className="p-2 default-shadow rounded-xl flex justify-between">
                <div
                className="flex p-2 w-50 text-nowrap default-shadow rounded-xl overflow-x-hidden">
                    {file.name}
                </div>
                <div className="flex justify-center items-center">
                    <span 
                    onClick={() => deleteFileEntry(file.id, setUploadedFiles)}
                    className="hover:bg-gray-400 p-2 rounded-xl">   
                        <Trash />
                    </span>
                </div>
            </div>
        </>
    )
}