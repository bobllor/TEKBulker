import { JSX } from "react";
import { OptionProps } from "../types";
import OptionBase from "./OptionBase";

const options: Array<OptionProps> = [
    {label: "Column: Name", func: () => {}, type: "text"},
    {label: "Column: Operating Company", func: () => {}, type: "text"},
]

export default function Mapping(): JSX.Element{
    return (
        <>
            <OptionBase options={options} title={"Mapping"} />
        </>
    )
}