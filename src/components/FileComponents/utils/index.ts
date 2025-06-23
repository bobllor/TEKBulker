import '../../../types.ts';

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

export async function uploadFile(
    event: React.SyntheticEvent<HTMLFormElement>,
    fileArr: File[]): Promise<void>{
    event.preventDefault();

    for(const file of fileArr){
        const fileExtension: string|undefined = file?.name.split('.').at(-1);

        if(!file || !fileExtension || fileExtension?.toLowerCase() != 'xlsx'){
            console.log('FIX ME: add alert here for incorrect file type.');
            continue;
        }

        // this will probably be moved out, depending on what i do with the array.
        try{
            const b64: string|ArrayBuffer|null = await getBase64(file);
            
            // TODO: add alerts with the response from the api
            const res: {status: string, message: string} = await window.pywebview.api.generate_azure_csv(b64);

            if(res.status == 'success'){
                console.log(`FIX ME: add alert for ${res.message}`);
            }
        }catch(error){
            console.log(`FIX ME: add alert here for ${error}`);
        }
    }
}

export function onDragDrop(event: DragEvent): void{
    event.preventDefault();
    const files: FileList|null = event.dataTransfer?.files ?? null;

    console.log(files);
}