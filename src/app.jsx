
import React, { useState } from 'react'
import DashboardChartsPreview from './DashboardChartsPreview'

export default function App(){
  const [theme, setTheme] = useState('dark')
  // simple theme switcher by toggling CSS variables
  React.useEffect(() => {
    if(theme === 'dark'){
      document.documentElement.style.setProperty('--bg','#07122a')
      document.documentElement.style.setProperty('--panel','#061226')
      document.documentElement.style.setProperty('--muted','#94a3b8')
      document.documentElement.style.setProperty('--text','#e6eef8')
    } else {
      document.documentElement.style.setProperty('--bg','#f8fafc')
      document.documentElement.style.setProperty('--panel','#ffffff')
      document.documentElement.style.setProperty('--muted','#475569')
      document.documentElement.style.setProperty('--text','#0f172a')
    }
  },[theme])
  return (
    <div style={{height:'100vh', display:'flex', flexDirection:'column'}}>
      <header style={{padding:12, display:'flex', justifyContent:'space-between', alignItems:'center', background: 'linear-gradient(90deg, rgba(255,255,255,0.02), transparent)'}}>
        <div style={{fontWeight:800}}>Design System — Charts Preview</div>
        <div>
          <button onClick={() => setTheme(prev => prev==='dark'?'light':'dark')} style={{padding:'8px 12px', borderRadius:8, border:'none', cursor:'pointer'}}>
            Toggle {theme==='dark'?'Light':'Dark'}
          </button>
        </div>
      </header>
      <div style={{flex:1}}>
        <DashboardChartsPreview />
      </div>
    </div>
  )
}
