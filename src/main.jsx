import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Component from './components/issues.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Component />
  </StrictMode>,
)
