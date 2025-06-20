import { useState, useRef } from "react"
import DragUpload from "./UploadComp/DragUpload"
import UploadForm from "./UploadComp/UploadForm"

export default function Upload(){
    const [showDrag, setShowDrag] = useState(false);

    const inputFileRef = useRef(null);

    return (
        <>
            <UploadForm inputFileRef={inputFileRef}/>
        </>
    )
}