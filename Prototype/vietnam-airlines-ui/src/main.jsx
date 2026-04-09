import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import BookingPage from './BookingPage.jsx'

const pathname = window.location.pathname.replace(/\/$/, '')
const RootComponent = pathname === '/booking' ? BookingPage : App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>,
)
