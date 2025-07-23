import { toastError, toastSuccess } from '../../../toastUtils.ts';
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
            toastError("Only Excel files (.xlsx) are accepted.");
            return;
        }

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
        toastError("No files were submitted.");
        return;
    }

    for(const file of fileArr){
        const fileExtension: string|undefined = file.file?.name.split('.').at(-1);

        if(!file || !fileExtension || fileExtension?.toLowerCase() != 'xlsx'){
            toastError(`Only Excel files (.xlsx) are supported, got file type .${fileExtension}.`);
            continue;
        }

        // this will probably be moved out, depending on what i do with the array.
        try{
            const b64: string|ArrayBuffer|null = await getBase64(file.file);
            
            // TODO: add alerts with the response from the api
            const res: {
                status: string, message: string
            } = await window.pywebview.api.generate_azure_csv(b64, file.name);
            
            if(res.status == 'success'){
                toastSuccess(res.message);
            }else{
                toastError(res.message);
            }
        }catch(error){
            toastError(error);
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