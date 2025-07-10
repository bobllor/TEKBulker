import { useState, useRef, JSX, useMemo } from "react";
import { addEntry, submitManualEntry, validateInput } from "./manualUtils/functions";
import { formInputs } from "./manualUtils/vars";
import { useManualData } from "./manualUtils/hooks";
import { FormStateProps, InputDataProps } from "./manualUtils/types";
import ManualTable from "./ManualTable";

const labelText: {name: string, opco: string} = {
    name: 'Name', opco: 'Operating Company'
}

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
                    <div className="flex flex-col" 
                    key={i}>
                        <span className="p-1">
                            {labelText[Object.keys(labelText)[i]]}
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
                disabled={disableSubmit}
                onClick={() => addEntry(divRef, setManualData)}>Add Entry</button>
            </div>
            <div
            className="relative overflow-y-scroll min-w-120 max-w-120 min-h-60 max-h-60">
                {manualData.length > 0 ? 
                <ManualTable manualData={manualData} setManualData={setManualData} /> :
                <div
                className="w-full flex justify-center items-center bg-gray-200 px-4 py-1 uppercase">
                    <p><strong>No entries entered</strong></p>
                </div>
                }
            </div>
            <div>
                <button
                onClick={() => submitManualEntry(manualData)}>Submit</button>
            </div>
        </>
    )
}