import React, { JSX } from "react";
import { FormatCase, FormatStyle, FormatType } from "../../pywebviewTypes";

export default function DropDown({obj, objId, defaultValue, func}: DropDownProps): JSX.Element{
    return (
        <>
            <select
            className="outline-none"
            tabIndex={-1}
            defaultValue={defaultValue}
            onChange={(e) => handleOnChangeSelect(e, objId, func)}>
                {obj.map((ele) => (
                    <option value={ele.value}>{ele.text}</option>
                ))}
            </select>
        </>
    )
}

async function handleOnChangeSelect(
    e: React.ChangeEvent<HTMLSelectElement>, 
    key: string,
    func?: DropDownProps["func"],){
    const selectedValue: string = e.currentTarget.value;

    if(func){
        func(key, selectedValue);
    }
}

type DropDownProps = {
    obj: Array<DropDownObject>,
    objId: string,
    defaultValue: DropDownObject["value"],
    func?: (...args: any[]) => void | undefined,
}

export type DropDownObject = {
    value: FormatCase | FormatStyle | FormatType,
    text: string,
}