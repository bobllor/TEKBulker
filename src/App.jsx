import { Routes, Route } from "react-router";
import { useState } from "react";
import Buttons from "./components/Buttons";
import Custom from "./routes/Custom";
import Home from "./routes/Home";
import Modal from "./components/Modal";
import { useModalContext } from "./context/ModalContext";
import { Toaster } from "react-hot-toast";

const fullPageStyle = 'h-screen w-screen flex flex-col justify-center items-center overflow-hidden relative p-3'

export default function App() {
  // used for buttons and the manual form for the unload.
  const [formEdited, setFormEdited] = useState(false);

  const { revealModal, showModal } = useModalContext();

  return (
    <> 
      <div 
      onDragOver={e => e.preventDefault()}
      onDrop={e => e.preventDefault()}
      className={fullPageStyle}>
        <Toaster />
        {showModal && <Modal />}
        <div className="flex justify-center items-center gap-2">
          <Buttons formState={{state: formEdited, func: setFormEdited}}/>
        </div>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/custom' element={<Custom style={fullPageStyle} 
              formState={{state: formEdited, func: setFormEdited}}/>} />
        </Routes>
      </div>
    </>
  )
}
