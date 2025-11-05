import React, { JSX } from "react";
import { OptionBaseProps } from "../types";


export default function OptionBase({options, title}: OptionBaseProps): JSX.Element{
    return (
        <>
        <div className="overflow-y-auto">
            <div className="border-b-2 m-2 p-2 flex items-center">
                <h2 className="text-lg">
                    {title}
                </h2>
            </div>
            {options.map((opt, i) => (
                <div 
                key={i}
                className="flex justify-between items-center border-b-1 m-2 p-2 text-sm">
                    {opt.label}
                    <form
                    onSubmit={e => e.preventDefault()}>
                        {opt.type == "text" &&
                            <TextComponent name={opt.elementName ? opt.elementName : "noNameFound"}/>
                        }
                    </form>
                </div>
            ))}
        </div>
        </>
    )
}

const TextComponent = ({name}: {name: string}) => (
    <input
    name={name}
    className="border-2 rounded-xl py-1 px-2 outline-none"
    type="text" />
)

async function onSubmitText(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault();

    const targetInput: HTMLInputElement|null = event.currentTarget.children.item(0) as HTMLInputElement;
    
    const keyToChange: string = targetInput.getAttribute("name")!;
    const value: string = targetInput.value;

    await window.pywebview.api.update_key(keyToChange, value).then((res: {}) => {
        console.log(res);
    });
}