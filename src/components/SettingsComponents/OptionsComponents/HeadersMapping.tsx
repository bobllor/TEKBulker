import { JSX } from "react";
import { OptionProps, ReaderType } from "../types";
import OptionBase from "./OptionBase";
import { onSubmitText } from "../functions";

const TextComponent = ({name, readerType}: {name: string, readerType: ReaderType}) => (
    <form
    onSubmit={e => onSubmitText(e, readerType)}>
        <input
        name={name}
        className="border-2 rounded-xl py-1 px-2 outline-none"
        type="text" />
    </form>
)

const title: string = "Headers";
const readerType: ReaderType = "excel";
const options: Array<OptionProps> = [
    {label: "Name", element: <TextComponent name={"name"} readerType={readerType} />},
    {label: "Operating Company", element: <TextComponent name={"opco"} readerType={readerType} />},
]

export default function HeadersMapping(): JSX.Element{
    return (
        <>
            <OptionBase options={options} title={title} />
        </>
    )
}