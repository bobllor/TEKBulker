import { JSX } from "react";
import { OptionProps } from "../types";
import OptionBase from "./OptionBase";

const title: string = "Mapping/Column";
const options: Array<OptionProps> = [
    {label: "Name", func: () => {}, type: "text"},
    {label: "Operating Company", func: () => {}, type: "text"},
]

export default function Mapping(): JSX.Element{
    return (
        <>
            <OptionBase options={options} title={title} />
        </>
    )
}