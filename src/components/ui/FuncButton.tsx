import { JSX } from "react";
import { ButtonProps } from "./types";

export default function Button(
    {text, bg = "bg-blue-500", bgHover = "bg-blue-400", paddingX, paddingY}: ButtonProps): JSX.Element{
    return (
        <>
            <button
            className={`px-${paddingX} py-${paddingY} rounded-xl ${bg} text-white hover:${bgHover}`}
            type="submit">{text}</button>
        </>
    )
}