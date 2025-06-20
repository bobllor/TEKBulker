import { getBase64 } from "./utils";

export async function uploadFile(
    event: React.SyntheticEvent<HTMLFormElement>,
    inputFileRef: React.RefObject<HTMLInputElement>): Promise<void>{
        event.preventDefault();

        const file: File|null|undefined = inputFileRef.current.files?.item(0);
        const fileExtension: string|undefined = file?.name.split('.').at(-1);

        if(!file || !fileExtension || fileExtension?.toLowerCase() != 'xlsx'){
            console.log('FIX ME: add alert here for incorrect file type.');
            return;
        }
        
        try{
            const b64: string|ArrayBuffer|null = await getBase64(file);
            
            // TODO: add alerts with the response from the api
            const res = await window.pywebview.api.generate_azure_csv(b64);
        }catch(error){
            console.log(`FIX ME: add alert here for ${error}`);
        }
}