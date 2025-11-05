import { JSX } from "react";
import { OptionProps, ReaderType } from "../types";
import OptionBase from "./OptionBase";
import { onSubmitText } from "../functions";

const readerType: ReaderType = "excel";
const TextComponent = ({name}: {name: string}) => (
    <form
    onSubmit={e => onSubmitText(e, readerType)}>
        <input
        name={name}
        className="border-2 rounded-xl py-1 px-2 outline-none"
        type="text" />
    </form>
)

const title: string = "Headers";
const options: Array<OptionProps> = [
    {label: "Name", type: "text", element: <TextComponent name={"name"} />},
    {label: "Operating Company", type: "text", element: <TextComponent name={"opco"} />},
]

export default function HeadersMapping(): JSX.Element{
    return (
        <>
            <OptionBase options={options} title={title} />
        </>
    )
}