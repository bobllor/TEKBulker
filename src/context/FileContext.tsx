import { JSX } from "react";
import { useContext, createContext, useState } from "react";

const FileContext = createContext<FileData>({
    uploadedFiles: [],
    setUploadedFile: () => {}
});

export const useFileContext = () => useContext(FileContext);

export function FileProvider({ children }): JSX.Element {
    // will be an array, future proof if i decide to add multiple file support
    const [uploadedFiles, setUploadedFile] = useState<File[]>([]);

    const data: FileData = {
        uploadedFiles,
        setUploadedFile
    }

    return (
        <>
            <FileContext.Provider value={data}>
                {children}
            </FileContext.Provider>
        </>
    )
}

type FileData = {
    uploadedFiles: File[],
    setUploadedFile: React.Dispatch<React.SetStateAction<File[]>>,
}