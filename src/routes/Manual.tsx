import { JSX } from "react";
import ManualForm from "../components/FormComponents/ManualForm";

export default function Manual({style}: {style: string}): JSX.Element{
    return (
        <>
            <div
            className={style}>
                <ManualForm />
            </div>
        </>
    )
}