import { useEffect } from "react";
import { OpcoMap, ReaderType } from "./types";

export function useOpcoInit(setOpcoFunc: React.Dispatch<React.SetStateAction<Array<OpcoMap>>>){
    const getReaderContent = async (reader: ReaderType) => {
       await window.pywebview.api.get_reader_content(reader).then((res: Record<string, string>) => {
        const keys: Array<string> = Object.keys(res)

        keys.forEach(key => {
            const opco: OpcoMap = Object();

            opco.key = key;
            opco.value = res[key];

            setOpcoFunc(prev => [...prev, opco])
        })
       })
    }

    const reader: ReaderType = "opco";

    useEffect(() => {
        getReaderContent(reader);
    }, [])
}