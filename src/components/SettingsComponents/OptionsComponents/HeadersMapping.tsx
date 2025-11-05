import { JSX } from "react";
import { OptionProps } from "../types";
import OptionBase from "./OptionBase";

const title: string = "Headers";
const options: Array<OptionProps> = [
    {label: "Name", func: () => {}, type: "text", elementName: "name"},
    {label: "Operating Company", func: () => {}, type: "text", elementName: "opco"},
]

export default function HeadersMapping(): JSX.Element{
    return (
        <>
            <OptionBase options={options} title={title} />
        </>
    )
}