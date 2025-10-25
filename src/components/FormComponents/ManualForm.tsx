import { useState, useRef, JSX } from "react";
import { addEntry, submitManualEntry, validateInput } from "./manualUtils/functions";
import { formInputs } from "./manualUtils/vars";
import { useManualData } from "./manualUtils/hooks";
import { FormStateProps, InputDataProps, SelectStateProps } from "./manualUtils/types";
import ManualTable from "./ManualTable";

/** Form for manual entries instead of reading an Excel file. */
export default function ManualForm({formState, select}:{
        formState: FormStateProps,
        select: SelectStateProps}
    ): JSX.Element{
    const divRef: React.RefObject<HTMLDivElement|null> = useRef(null);

    const [manualData, setManualData] = useManualData(formState);
    
    // input validation to prevent duplicates
    const [inputData, setInputData] = useState<InputDataProps>(
        {nameValue: '', opcoValue: ''}
    );
    const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

    return (
        <>
            <div
            className="flex flex-col gap-3 pb-5"
            ref={divRef}>
                {formInputs.map((obj, i) => (
                    <div className="flex flex-col" 
                    key={i}>
                        <span className="p-1">
                            {obj.label}
                        </span>
                        <input name={Object.keys(inputData)[i]}
                        id={obj.name}
                        spellCheck={false}
                        className={`outline-blue-300 border-1 px-3 py-1 rounded-xl 
                            ${disableSubmit && 'border-red-300 outline-red-300'}`}
                        onChange={(e) => validateInput(e, setInputData, setDisableSubmit)}
                        onKeyDown={(e) => e.key == 'Enter' && addEntry(divRef, setManualData)}
                        type="text" />
                    </div>
                ))}
                <button
                className={`px-5 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-400`}
                disabled={disableSubmit}
                onClick={() => addEntry(divRef, setManualData)}>Add Entry</button>
            </div>
            <div
            className="relative overflow-y-scroll min-w-150 max-w-150 min-h-80 max-h-80">
                {manualData.length > 0 ? 
                <ManualTable manualData={manualData} setManualData={setManualData} select={select}/> :
                <div
                className="w-full flex justify-center items-center bg-gray-200 px-4 py-1 uppercase">
                    <p><strong>No entries entered</strong></p>
                </div>
                }
            </div>
            <div>
                <button
                className={`px-10 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-400`}
                onClick={() => submitManualEntry(manualData)}>Submit</button>
            </div>
        </>
    )
}