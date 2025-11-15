import { JSX } from "react";
import OptionBase from "./OptionBase";

const title: string = "Text Template";

export default function TextForm(): JSX.Element{
    return (
        <>
            <OptionBase title={title}/>
        </>
    )
}

function TextField(): JSX.Element{
    return (
        <>
            <input 
            type="text" /> 
        </>
    )
}