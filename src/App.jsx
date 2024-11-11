import { useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
  <div>
    <LoadingScreen />
  </div>
  )
}

export default App
