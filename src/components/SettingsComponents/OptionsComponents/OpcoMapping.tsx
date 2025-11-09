import React, { JSX, useState, useRef } from "react";
import { OpcoMap, ReaderType } from "../types";
import { useOpcoInit } from "../hooks";
import { addOpcoEntry } from "../functions";
import { compareObjects } from "../../../utils";
import OptionBase from "./OptionBase";
import OpcoRow from "./OpcoRow";

const title: string = "Operating Companies";

export default function OpcoMapping(): JSX.Element{
    const [opcoOptions, setOpcoOptions] = useState<Array<OpcoMap>>([]);
    const [inputData, setInputData] = useState({keyOpco: "", valueOpco: ""});
    const [isEditable, setIsEditable] = useState(false);

    const [resetDefault, setResetDefault] = useState(false);

    // used to keep track of the previous options prior to any updates.
    const baseOpcoRef = useRef<Array<OpcoMap>>([]);
    const opcoKeysRef = useRef<Set<string>>(new Set());

    useOpcoInit(baseOpcoRef, opcoKeysRef, setOpcoOptions);

    return (
        <>
            <OptionBase title={title} />
            {opcoOptions.length == 0 
                ? <div>No entries TODO: add the spinner here</div>
                :
                <>
                    <form
                    onSubmit={e => addOpcoEntry(e, setOpcoOptions)}>
                        {Object.keys(inputData).map((name, i) => (
                            <input 
                            key={i}
                            type="text"
                            onChange={e => setInputData(prev => {
                                if(e.currentTarget.getAttribute("name")!.includes("key")){
                                    return {...prev, keyOpco: e.currentTarget.value};
                                }

                                return {...prev, valueOpco: e.currentTarget.value};
                            })}
                            name={name} />
                        ))}
                        <input type="submit"/>
                    </form>
                    <div className="flex">
                        <div className="px-2 w-20 hover:bg-gray-500 flex items-center justify-center"
                        onClick={() => {
                                if(isEditable){
                                    updateOpcoMapping(opcoOptions, baseOpcoRef).then(status => {
                                        if(status){
                                            // update the set for the keys.
                                            opcoKeysRef.current.clear();
                                            opcoOptions.forEach((opco) => {
                                                opcoKeysRef.current.add(opco.opcoKey);
                                            })
                                        }
                                    });
                                }
                                setIsEditable(prev => !prev);
                            }
                        }>
                            {!isEditable ? "Edit" : "Confirm"}
                        </div>
                        {isEditable && 
                            <div 
                            onClick={() => {
                                // this is manually edited inside OpcoRow, i cannot figure out
                                // why setOpcoOptions does not get updated upon cancel.
                                // something with baseOpcoRef.current... i dont know.
                                setIsEditable(prev => !prev);
                                setResetDefault(true);
                            }}
                            className="flex items-center justify-center hover:bg-gray-500 w-20">
                                Cancel
                            </div>
                        }
                    </div>
                    <table className="w-full text-center border-1 table-fixed">
                        <thead>
                            <tr>
                                <th>Operating Company</th>
                                <th>Domain</th>
                            </tr>
                        </thead>
                        <tbody>
                            {opcoOptions.map((opco, i) => (
                                <React.Fragment
                                key={i}>
                                    <OpcoRow opco={opco} resetProp={{resetDefault: resetDefault, setResetDefault: setResetDefault}}
                                    isEditable={isEditable} setOpcoOptions={setOpcoOptions} 
                                    baseOpco={baseOpcoRef.current[i]}/>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </>
            }
        </>
    )
}

/**
 * Updates the operating company mapping for the backend. The operating company array mapper is updated inside
 * `OpcoRow`.
 * @param opcoOptions - The operating company array mapper.
 * @param baseOpcoRef - The base operating company array mapper, used to prevent calls on unchanged values.
 * @returns funcStatus - If the function succeeds or not.
 */
async function updateOpcoMapping(
    opcoOptions: Array<OpcoMap>,
    baseOpcoRef: React.RefObject<Array<OpcoMap>>): Promise<boolean>{
        let hasChanged: boolean = false;
        for (let i = 0; i < baseOpcoRef.current.length; i++) {
            if(hasChanged){
                break;
            }

            const baseOpco: OpcoMap = baseOpcoRef.current[i];
            const newOpco: OpcoMap = opcoOptions[i]; 

            hasChanged = compareObjects(baseOpco, newOpco);
        }

        if(hasChanged){
            let flattenedOpcoMap: Record<string, string> = {};
            // flattening the opco for the backend call
            opcoOptions.forEach((opco) => {
                const newOpco: OpcoMap = opco;

                const newKey: string = newOpco.opcoKey;
                const newVal: string = newOpco.value;

                flattenedOpcoMap[newKey] = newVal;
            })
            
            const reader: ReaderType = "opco";
            //window.pywebview.api.insert_update_many(reader, flattenedOpcoMap);

            // update the base ref.
            baseOpcoRef.current = [...opcoOptions];
        }

        return hasChanged;
}