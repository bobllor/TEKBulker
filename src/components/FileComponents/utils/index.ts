import React from 'react';
import { toaster } from '../../../toastUtils.ts';
import '../../../types.ts';
import { UploadedFilesProps } from './types.ts';

//** Updates the uploaded files state with the event file from the input element. */
export function onFileChange(
    event: React.SyntheticEvent<HTMLInputElement>, 
    setUploadedFiles: React.Dispatch<React.SetStateAction<Array<UploadedFilesProps>>>){
        const id: string = Date.now().toString();
        const file: File|undefined = event.currentTarget.files?.[0];

        if(!file) return;

        const fileName: string = file.name;

        if(fileName.split(".").at(-1)?.toLowerCase() != 'xlsx'){
            toaster("Only Excel files (.xlsx) are accepted.", "error");
            return;
        }

        // some weird thing with input elements. if i recall this was an issue in my last project too.
        event.currentTarget.value = "";

        setUploadedFiles(prev => [...prev, {id: id, name: fileName, file: file}]);
}

//** Reads a file and generates a Base64 string for decoding. */
async function getBase64(file: File): Promise<string | ArrayBuffer | null>{
    return new Promise((resolve, reject) => {
        const reader: FileReader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = (error) => {
            reject(error);
        }
    })
}

//** Upload the file state and and generate the CSV for Azure. */
export async function uploadFile(
    event: React.SyntheticEvent<HTMLFormElement>,
    fileArr: Array<UploadedFilesProps>): Promise<void>{
    event.preventDefault();

    if(fileArr.length == 0){
        toaster("No files were submitted.", "error");
        return;
    }

    const b64Arr: Array<{fileName: string, b64: string}> = [];

    for(const file of fileArr){
        const fileExtension: string|undefined = file.file?.name.split('.').at(-1);

        if(!file || !fileExtension || fileExtension?.toLowerCase() != 'xlsx'){
            toaster(`Only Excel files (.xlsx) are supported, got file type .${fileExtension}.`, "error");
            continue;
        }
        
        const b64: string|ArrayBuffer|null = await getBase64(file.file);

        b64Arr.push({fileName: file.name, b64: b64 as string})
    }

    try{
        // TODO: use the loop above to do this.
        // YOU are going to implement a UI/UX feature here to show success/fails on each
        // file uploaded from this method call.
        const res: {
            status: string, message: string
        } = await window.pywebview.api.generate_azure_csv(b64Arr);
        
        if(res.status == 'success'){
            toaster(res.message, "success");
        }else{
            toaster(res.message, "error");
        }
    }catch(error){
        if(error instanceof Error){
            toaster(error.message, "error");
        }
    }
}

export function onDragDrop(event: DragEvent, 
    setUploadedFiles: React.Dispatch<React.SetStateAction<Array<UploadedFilesProps>>>
): void{
    event.preventDefault();
    const id: string = Date.now().toString();
    const file: File|null = event.dataTransfer?.files[0] ?? null;

    if(!file) return;

    setUploadedFiles(prev => [...prev, {id: id, name: file.name, file: file}]);
}

//** Removes an object from the uploaded files state on a matching ID. */
export function deleteFileEntry(
    fileID: string,
    setUploadedFiles: React.Dispatch<React.SetStateAction<Array<UploadedFilesProps>>>,
): void{
    setUploadedFiles(prev => prev.filter(ele => {
        return ele.id != fileID;
    }));
}