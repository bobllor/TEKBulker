import { onDragDrop } from "./utils";
import { useFileContext } from "../../context/FileContext"

export default function DragZone({showDrop, setShowDrop}){
    const { setUploadedFiles } = useFileContext();

    function dragOver(event){
        event.preventDefault();

        if(!showDrop){
            setShowDrop(true);
        }
    }
    function dragLeave(event){
        event.preventDefault();
        
        if(showDrop){
            setShowDrop(false);
        }
    }
    
    return (
        <>
            <div
            onDragOver={(e) => dragOver(e)}
            className={`absolute h-100 w-150 flex justify-center items-center`}>
                {showDrop && 
                    <div
                    onDragLeave={(e) => dragLeave(e)}
                    onDrop={(e) => {
                        onDragDrop(e, setUploadedFiles);

                        // ensures it will always turn off the zone.
                        if(showDrop){
                            setShowDrop(false);
                        }
                    }}
                    className="z-2 absolute h-[inherit] w-[inherit] 
                    flex justify-center items-center bg-green-300">
                        <p className="pointer-events-none">Drop file here</p>
                    </div>
                }
            </div>
        </>
    )
}