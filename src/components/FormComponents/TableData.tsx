import { JSX, useState } from "react";
import EditCell from "./EditCell";
import { ManualData } from "./manualUtils/types";

export default function TableData({id, data, edit, maxLength, manData, select}: TableDataProps): JSX.Element{
    return (
        <>
            <td
            onClick={() => select.setSelectedCell(id + data)}
            onDoubleClick={() => edit.setEditCell(id + data)}
            className={`px-4 py-2 relative text-center text-wrap hover:bg-gray-400/40
            ${select.selectedCell == id + data && "bg-gray-400 outline-blue-400/40 outline-1 z-1"}`}>
                {data.length < maxLength ? data : data.slice(0, maxLength) + '...'}
                {id + data == edit.editCell && 
                <EditCell id={id} stringVal={data} setEditCell={edit.setEditCell} manData={manData}/>}
            </td>
        </>
    )
}

type TableDataProps = {
    id: string,
    data: string,
    maxLength: number,
    edit: {
        editCell: string,
        setEditCell: React.Dispatch<React.SetStateAction<string>>
    },
    manData: {
        manualData: Array<ManualData>
        setManualData: React.Dispatch<React.SetStateAction<Array<ManualData>>>
    }
    select: {
        selectedCell: string,
        setSelectedCell: React.Dispatch<React.SetStateAction<string>>
    }
}