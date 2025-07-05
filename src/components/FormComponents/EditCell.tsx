import { JSX, useEffect, useRef } from "react";
import { ManualData } from "./manualUtils/types";

/** Component of ManualTable that reveals an edit box for a selected cell. */
export default function EditCell({id, stringVal, setSelectedCell, setManualData}: EditCellProps): JSX.Element{
    const inputRef = useRef<HTMLInputElement|null>(null);
    
    useEffect(() => {
        if(inputRef.current){
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [])
    
    return (
        <>
            <div
            className="absolute z-3 top-[50%] bg-white border-1 p-3 flex justify-center items-center gap-5">
                <input className="border-1 p-2 rounded-xl w-35"
                spellCheck={false}
                ref={inputRef}
                type="text" defaultValue={stringVal} 
                onKeyDown={(e) => {
                    if(e.key == 'Escape') setSelectedCell('');

                    if(e.key == 'Enter'){
                        const inputVal: string = e.currentTarget.value;
                        
                        if(inputVal.trim() == stringVal){
                            setSelectedCell('');
                        }else{
                            setManualData(prev => {
                                const newData: Array<ManualData> = prev.map((obj) => {
                                    const objID: string = obj.id!;
                                    
                                    // id is unique (even with dupes in names)
                                    // id = obj.id + obj.name, easy way to diff the two columns
                                    if(id.includes(objID)){
                                        const columnVal: string = id.replace(objID, '');
                                        
                                        for(const key of Object.keys(obj)){
                                            if(obj[key] == columnVal){
                                                return {
                                                    ...obj,
                                                    [key]: inputVal
                                                }
                                            }
                                        }
                                    }
                                    
                                    // i'm like 95% sure this will not be reached.
                                    return {...obj};
                                })

                                return newData;
                            })

                            setSelectedCell('');
                        };
                    }
                }}/>
                <div
                className="flex gap-5">
                    <span>
                        C
                    </span>
                    <span
                    onClick={() => setSelectedCell('')}>
                        X
                    </span>
                </div>
            </div>
        </>
    )
}

type EditCellProps = {
    id: string,
    stringVal: string,
    setSelectedCell: React.Dispatch<React.SetStateAction<string>>,
    setManualData: React.Dispatch<React.SetStateAction<Array<ManualData>>>
}