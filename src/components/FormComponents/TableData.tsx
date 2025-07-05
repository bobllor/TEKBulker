import { JSX } from "react";
import EditCell from "./EditCell";
import { ManualData } from "./manualUtils/types";

export default function TableData({id, data, select, maxLength, setManualData}: TableDataProps): JSX.Element{
    return (
        <>
            <td
            onDoubleClick={() => select.setCurr(id + data)}
            className="px-4 py-2 relative border-1 border-blue-400 text-center text-wrap">
                {data.length < maxLength ? data : data.slice(0, maxLength) + '...'}
                {id + data == select.curr && 
                <EditCell id={id} stringVal={data} setSelectedCell={select.setCurr} setManualData={setManualData}/>}
            </td>
        </>
    )
}

type TableDataProps = {
    id: string,
    data: string,
    maxLength: number,
    select: {
        curr: string,
        setCurr: React.Dispatch<React.SetStateAction<string>>
    },
    setManualData: React.Dispatch<React.SetStateAction<Array<ManualData>>>
}