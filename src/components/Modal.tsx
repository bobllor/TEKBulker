import { JSX, useMemo } from "react";
import { useModalContext } from "../context/ModalContext";

export default function Modal(): JSX.Element{
    const {
        modalText, 
        confirmModal, 
        declineModal, 
        showModal
    } = useModalContext();

    const buttons: Array<{name: string, func: () => void}> = useMemo(() => {
        return [
            {name: 'Confirm', func: confirmModal},
            {name: 'Cancel', func: declineModal}
        ]
    }, [])

    return (
        <>
            <div className="flex flex-col bg-white w-100 h-50 z-4 absolute">
                <div>
                    <span>{modalText}</span>
                </div>
                <div>
                    {buttons.reverse().map((obj, i) => (
                    <button key={i} onClick={obj.func}>
                        {obj.name}
                    </button>
                    ))}
                </div>
            </div>
        </>
    )
}