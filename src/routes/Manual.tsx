import React, { JSX } from "react";
import ManualForm from "../components/FormComponents/ManualForm";

export default function Manual({style, formState}: ManualProps): JSX.Element{
    return (
        <>
            <div
            className={style}>
                <ManualForm formState={formState}/>
            </div>
        </>
    )
}

type ManualProps = {
    style: string,
    formState: {
        state: boolean,
        func: React.Dispatch<React.SetStateAction<boolean>>
    }
}