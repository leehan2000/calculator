import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

/**
 * 브이원 요금계산기 애플리케이션 진입점
 * React 18의 새로운 createRoot API를 사용하여 앱을 렌더링
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 