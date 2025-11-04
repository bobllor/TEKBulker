import { JSX } from "react";
import { OptionBaseProps } from "../types";

export default function OptionBase({options, title}: OptionBaseProps): JSX.Element{
    return (
        <>
        <div className="overflow-y-auto">
            <div className="border-b-2 m-2 p-2 flex items-center">
                <h2 className="text-lg">
                    {title}
                </h2>
            </div>
            {options.map((opt, i) => (
                <div 
                key={i}
                className="flex justify-between items-center border-b-2 m-2 p-2">
                    {opt.label} 
                </div>
            ))}
        </div>
        </>
    )
}