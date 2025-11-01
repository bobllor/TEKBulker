import { JSX } from "react";
import { OUTER_MODAL_ROUNDING } from "./vars";

export default function General(): JSX.Element{
    return (
        <>
            <div className={`h-full w-[65%] bg-gray-200 absolute right-0
            ${OUTER_MODAL_ROUNDING}`}>

            </div>
        </>
    )
}