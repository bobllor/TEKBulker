import { JSX } from "react";
import { OptionBaseProps, OptionProps } from "../types";


export default function OptionBase({options = [], title}: OptionBaseProps): JSX.Element{
    return (
        <>
        <div className="overflow-y-auto">
            <div className="border-b-2 m-2 p-2 flex items-center">
                <h2 className="text-lg">
                    {title}
                </h2>
            </div>
            {options.length > 0 && options.map((opt, i) => (
                <div 
                key={i}
                className={getClassName(opt.justify)}>
                    <div className="flex flex-col">
                        {opt.label}
                        {opt.optElement && opt.optElement}
                    </div>
                    {opt.element}
                </div>
            ))}
        </div>
        </>
    )
}

/**
 * Generates the class name based off of justify. By default it will always be justify-between if undefined.
 * @param justify - The justification of the flex box.
 * @returns className
 */
function getClassName(justify: OptionProps["justify"] | undefined): string{
    let optionClassName: string = "flex items-center border-b-1 m-2 p-4 text-sm gap-3";

    switch (justify) {
        case "center":
            optionClassName = `${optionClassName} justify-center`;
            break;
        case "end":
            optionClassName = `${optionClassName} justify-end`;
            break;
        case "start":
            optionClassName = `${optionClassName} justify-start`;
            break;
        default:
            optionClassName = `${optionClassName} justify-between`;
            break;
    }

    return optionClassName;
}