import React, { JSX, useEffect, useRef } from "react";
import { OpcoMap } from "../types";

export default function OpcoRow({opco, baseOpco, isEditable, setOpcoOptions, resetProp}: OpcoRowProps): JSX.Element{
    // the key for default should not be editable.
    // this is only applicable to the key, as the default key cannot be edited but the value can.
    let inputEditable: boolean = isEditable && opco.opcoKey != "default" ? false : true;

    const rowRef = useRef<HTMLTableRowElement|null>(null);

    // not really a fan of this but i spent too much time trying to figure out why
    // the opcoOptions update does not work in the parent component.
    useEffect(() => {
        if(resetProp.resetDefault){
            const trChildren = rowRef.current!.children; 

            for(let i = 0; i < trChildren.length; i++){
                const td = trChildren[i] as HTMLTableCellElement;

                const inputEle = td.children[0] as HTMLInputElement;

                const inputType = inputEle.getAttribute("name");
                
                if(inputType == "key"){
                    inputEle.value = baseOpco.opcoKey;
                }else if(inputType == "value"){
                    inputEle.value = baseOpco.value;
                }
            }

            setOpcoOptions(prev => {
                return prev.map(prevOpco => {
                    if(opco.id == prevOpco.id){
                        return {...prevOpco, opcoKey: baseOpco.opcoKey, value: baseOpco.value};
                    }

                    return prevOpco;
                })
            });
        }

        resetProp.setResetDefault(false);
    }, [resetProp.resetDefault])

    return (
        <>
            <tr
            ref={rowRef}>
                <td>
                    <input 
                    type="text"
                    name="key"
                    readOnly={inputEditable}
                    onChange={e => handleOpcoChange(e, opco, setOpcoOptions, "key")}
                    defaultValue={opco.opcoKey}/>
                </td>
                <td>
                    <input 
                    type="text"
                    name="value"
                    readOnly={isEditable ? false : true}
                    onChange={e => handleOpcoChange(e, opco, setOpcoOptions, "value")}
                    defaultValue={opco.value}/>
                </td>
            </tr>
        </>
    )
}

function handleOpcoChange(
    e: React.ChangeEvent<HTMLInputElement>,
    opco: OpcoRowProps["opco"],
    setOpcoOptions: OpcoRowProps["setOpcoOptions"],
    target: "key" | "value"){
        const newValue: string = e.currentTarget.value;

        setOpcoOptions(prev => 
            prev.map((prevOpco) => {
                if(opco.id != prevOpco.id){
                    return prevOpco;
                }

                if(target == "key"){
                    return {...prevOpco, opcoKey: newValue}
                }else{
                    return {...prevOpco, value: newValue}
                }
            })
        )
}

type OpcoRowProps = {
    opco: OpcoMap,
    baseOpco: OpcoMap,
    resetProp: {resetDefault: boolean, setResetDefault: React.Dispatch<React.SetStateAction<boolean>>},
    setOpcoOptions: React.Dispatch<React.SetStateAction<Array<OpcoMap>>>,
    isEditable: boolean,
}