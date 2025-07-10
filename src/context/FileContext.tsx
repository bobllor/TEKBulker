import { JSX } from "react";
import { useContext, createContext, useState } from "react";

const FileContext = createContext<FileData>({
    uploadedFiles: [],
    setUploadedFiles: () => {}
});

export const useFileContext = () => useContext(FileContext);

export function FileProvider({ children }): JSX.Element {
    // will be an array, future proof if i decide to add multiple file support
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const data: FileData = {
        uploadedFiles,
        setUploadedFiles
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
    setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>,
}