export type UploadedFilesProps = {
    id: string,
    name: string,
    file: File,
    status: FileStatus,
}

export type FileStatus = "error" | "success" | "none"

export type GenerateCSVProps = {
    b64: string,
    fileName: string,
    id: string,
}