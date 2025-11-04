import { JSX } from "react";
import OptionBase from "./OptionBase";
import { OptionProps } from "../types";

const options: Array<OptionProps> = [
    {label: "Output Folder", func: () => {}, type: "button"}
]

export default function General(): JSX.Element{
    return (
        <>
            <OptionBase options={options} title="General" />
        </>
    )
}