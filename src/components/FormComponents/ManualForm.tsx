import { useState, useRef, JSX } from "react";
import { addEntry, validateInput } from "./manualUtils/functions";
import { formInputs } from "./manualUtils/vars";
import { useManualData } from "./manualUtils/hooks";
import { FormStateProps, InputDataProps } from "./manualUtils/types";
import ManualTable from "./ManualTable";

/** Form for manual entries instead of reading an Excel file. */
export default function ManualForm({formState}:{
        formState: FormStateProps}
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
                    <input name={Object.keys(inputData)[i]}
                    id={obj.name}
                    className={`border-1 px-3 py-1 rounded-xl ${disableSubmit && 'border-red-400'}`}
                    onChange={(e) => validateInput(e, setInputData, setDisableSubmit)}
                    onKeyDown={(e) => e.key == 'Enter' && addEntry(divRef, setManualData)}
                    type="text" key={i} />
                ))}
                <button
                disabled={disableSubmit}
                onClick={() => addEntry(divRef, setManualData)}>Submit</button>
            </div>
            <div
            className="relative overflow-y-scroll min-w-100 max-w-100 min-h-60 max-h-60">
                {manualData.length > 0 ? 
                <ManualTable manualData={manualData} setManualData={setManualData} /> :
                <div
                className="w-full flex justify-center items-center bg-gray-200 px-4 py-1 uppercase">
                    <p><strong>No entries entered</strong></p>
                </div>
                }
            </div>
        </>
    )
}