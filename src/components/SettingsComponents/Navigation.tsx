import { JSX } from "react";
import { RIGHT_BORDER_THICKNESS, TL_MODAL_ROUNDING, BL_MODAL_ROUNDING } from "./vars";

export default function Navigation(): JSX.Element{
    return (
        <>
            <div className={`h-full w-[35%] bg-gray-500/60 absolute 
            ${TL_MODAL_ROUNDING} ${BL_MODAL_ROUNDING}
            ${RIGHT_BORDER_THICKNESS}`}>

            </div>
        </>
    )
}