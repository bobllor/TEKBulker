import { Routes, Route, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import Custom from "./routes/Custom";
import Home from "./routes/Home";
import Settings from "./routes/Settings";
import Modal from "./components/Modal";
import CogWheelIcon from "./svgs/CogWheelIcon";
import { useModalContext } from "./context/ModalContext";
import { ToastContainer } from "react-toastify";
import General from "./components/SettingsComponents/OptionsComponents/General";
import HeadersMapping from "./components/SettingsComponents/OptionsComponents/HeadersMapping";

const fullPageStyle = 'h-screen w-screen flex flex-col justify-center items-center overflow-hidden relative p-3'

export default function App() {
  // used for buttons and the manual form for the unload.
  const [formEdited, setFormEdited] = useState(false);
  
  const [showSetting, setShowSetting] = useState(false);

  let location = useLocation();
  const navigate = useNavigate();

  const { showModal } = useModalContext();

  useEffect(() => {
    if(location.pathname.includes("settings")){
      setShowSetting(true);
    }
  }, [location])

  return (
    <> 
      <div 
      onDragOver={e => e.preventDefault()}
      onDrop={e => e.preventDefault()}
      className={fullPageStyle}>
        <ToastContainer />
        {showModal && <Modal />}
        {location.state?.previousLocation &&
          <Routes>
            <Route path="settings" element={<Settings setShowSetting={setShowSetting} />}> 
              <Route index element={<General />} />
              <Route path="headers-mapping" element={<HeadersMapping />} />
            </Route>
          </Routes>
        }
        <div
        className={`absolute flex justify-center items-center rounded-2xl p-1 left-0 bottom-0 m-10 z-3 
        hover:bg-gray-500 ${showSetting && "pointer-events-none"}`}>
          <button
          className="outline-none"
          tabIndex={-1}
          onClick={() => navigate("/settings", {replace: true, state: {previousLocation: location}})}>
            <CogWheelIcon width="32px" height="32px" stroke="black" />
          </button>
        </div>
        <div className="flex justify-center items-center gap-2">
          <Navigation formState={{state: formEdited, func: setFormEdited}}/>
        </div>
        <Routes location={location.state?.previousLocation || location}>
            <Route path='/' element={<Home />} />
            <Route path='custom' element={<Custom style={fullPageStyle} 
              formState={{state: formEdited, func: setFormEdited}}/>} />
            <Route path="settings" element={<Settings setShowSetting={setShowSetting} />} />
        </Routes>
      </div>
    </>
  )
}
