import { JSX, useEffect, useRef } from "react";
import { ManualData } from "./manualUtils/types";
import toast from "react-hot-toast";
import { toastError } from "../../toastUtils";

/** Component of ManualTable that reveals an edit box for a selected cell. */
export default function EditCell({id, stringVal, setEditCell, manData}: EditCellProps): JSX.Element{
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
            className="absolute h-12 z-3 top-[50%] bg-white border-1 p-3 flex justify-center items-center gap-5">
                <input className="border-1 py-1 px-2 rounded-xl w-35"
                spellCheck={false}
                ref={inputRef}
                type="text" defaultValue={stringVal} 
                onKeyDown={(e) => {
                    if(e.key == 'Escape') setEditCell('');

                    if(e.key == 'Enter'){
                        const inputVal: string = e.currentTarget.value;
                        // used only for comparisons
                        const loweredInputVal: string = inputVal.toLowerCase();

                        if(inputVal.trim() == ''){
                            toast.error('Cannot have an empty input for the name field.', {duration: 3000});
                            return;
                        }
                        
                        if(inputVal.trim() == stringVal){
                            setEditCell('');
                        }else{
                            const filteredObj: ManualData = manData.manualData.filter((obj) => id.includes(obj.id!))[0];

                            // the else condition guarantees that the input is different than the original column value. 
                            // yes, it is quite confusing... but i don't want to rewrite my function (hindsight 20/20)
                            const nameVal: string = filteredObj.name!.toLowerCase();
                            const columnVal: string = filteredObj.opco!.toLowerCase();

                            if(nameVal == loweredInputVal || columnVal == loweredInputVal){
                                toastError('Cannot have duplicate values for the fields.');
                                return;
                            }   
                            
                            manData.setManualData(prev => {
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

                            setEditCell('');
                        };
                    }
                }}/>
                <div
                className="flex gap-5">
                    <span>
                        C
                    </span>
                    <span
                    onClick={() => setEditCell('')}>
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
    setEditCell: React.Dispatch<React.SetStateAction<string>>,
    manData: ManDataProps
}

type ManDataProps = {
    manualData: Array<ManualData>
    setManualData: React.Dispatch<React.SetStateAction<Array<ManualData>>>
}