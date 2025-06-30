import { useRef, useState } from "react";
import DragZone from "../components/FileComponents/DragZone";
import UploadForm from "../components/FileComponents/UploadForm";
import FileUpload from "../components/FileComponents/FileUpload";
import { JSX } from "react";

export default function Home(): JSX.Element {
  const [showDrop, setShowDrop] = useState(false);

  const inputFileRef = useRef(null);

  return (
    <> 
      <div className='h-screen w-screen flex justify-center items-center overflow-hidden relative'>
        <DragZone showDrop={showDrop} setShowDrop={setShowDrop}/>
        <UploadForm inputFileRef={inputFileRef} FileUpload={FileUpload} showDrop={showDrop} />
      </div>
    </>
  )
}