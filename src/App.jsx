import { Routes, Route } from "react-router";
import { useState } from "react";
import Buttons from "./components/Buttons";
import Manual from "./routes/Manual";
import Home from "./routes/Home";
import Modal from "./components/Modal";
import { useModalContext } from "./context/ModalContext";
import { Toaster } from "react-hot-toast";

const fullPageStyle = 'h-screen w-screen flex flex-col justify-center items-center overflow-hidden relative'

export default function App() {
  // used for buttons and the manual form for the unload.
  const [formEdited, setFormEdited] = useState(false);

  const { revealModal, showModal } = useModalContext();

  return (
    <> 
      <div className={fullPageStyle}>
        <Toaster />
        {showModal && <Modal />}
        <div>
          <Buttons formState={{state: formEdited, func: setFormEdited}}/>
        </div>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/manual' element={<Manual style={fullPageStyle} 
              formState={{state: formEdited, func: setFormEdited}}/>} />
        </Routes>
      </div>
    </>
  )
}