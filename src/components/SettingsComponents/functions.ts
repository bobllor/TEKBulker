import { ReaderType, OpcoMap } from "./types";

/**
 * Handles text submission to update a key for the settings in the backend.
 * @param event - The React form event.
 * @param readerType - The type to obtain the correct value from the target Reader in the backend.
 */
export async function onSubmitText(event: React.FormEvent<HTMLFormElement>, readerType: ReaderType){
    event.preventDefault();

    const targetInput: HTMLInputElement|null = event.currentTarget.children.item(0) as HTMLInputElement;
    
    const keyToChange: string = targetInput.getAttribute("name")!;
    const value: string = targetInput.value;

    await window.pywebview.api.update_key(readerType, keyToChange, value).then((res: {}) => {
        console.log(res);
    });
}

/**
 * Adds an entry into the operating company map. It updates the front end state and the back end config.
 * @param event - The form event of the inputs.
 * @param setOpcoOptions - The state function to add a new entry in the OpcoMap array.
 */
export async function addOpcoEntry(
    event: React.FormEvent<HTMLFormElement>, 
    setOpcoOptions: React.Dispatch<React.SetStateAction<Array<OpcoMap>>>){
        event.preventDefault();
        const children = event.currentTarget.children;

        // keys of inputData object
        const keyName = "keyOpco";
        const valueName = "valueOpco";

        const opcoHolder: OpcoMap = {opcoKey: "", value: "", id: Date.now().toString()};

        for(let i = 0; i < children.length; i++){
            const element: HTMLInputElement = children[i] as HTMLInputElement;

            if(element.getAttribute("type") == "submit"){
                continue;
            }

            // validation will not allow this to be empty.
            const value: string = element.value;
            const elementName: string = element.getAttribute("name")!;

            if(elementName == keyName){
                opcoHolder.opcoKey = value;
            }else if(elementName == valueName){
                opcoHolder.value = value;
            }

            element.value = "";
        }

        setOpcoOptions(prev => [...prev, opcoHolder]);

        // TODO: make a res type and also work on the response.
        /*await window.pywebview.api.add_opco(opcoHolder).then((res: {}) => {
            console.log(res);
        });*/
}