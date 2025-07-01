import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FileProvider } from './context/FileContext.tsx'
import { BrowserRouter } from 'react-router'
import { ModalProvider } from './context/ModalContext.tsx'
import './styles.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ModalProvider>
        <FileProvider>
          <App />
        </FileProvider>
      </ModalProvider>
    </BrowserRouter>
  </StrictMode>,
)