import { OptionBaseProps } from "./types";

export async function onSubmitText(event: React.FormEvent<HTMLFormElement>, readerType: OptionBaseProps["readerType"]){
    event.preventDefault();

    const targetInput: HTMLInputElement|null = event.currentTarget.children.item(0) as HTMLInputElement;
    
    const keyToChange: string = targetInput.getAttribute("name")!;
    const value: string = targetInput.value;

    await window.pywebview.api.update_key(readerType, keyToChange, value).then((res: {}) => {
        console.log(res);
    });
}