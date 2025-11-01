import { JSX } from "react";
import { ButtonProps } from "./types";

/**
 * A submit button component. 
 * @param text The text of the button 
 * @param bg Tailwind class string for the background of the button, by default it is bg-blue-500
 * @param bgHover Tailwind class string for the hover background of the button, by default it is bg-blue-400 
 * @param paddingX Number representing the padding amount for the X-axis
 * @param paddingY Number representing the padding amount for the Y-axis
 */
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