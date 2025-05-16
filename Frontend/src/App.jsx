import { useState } from 'react'
import './App.css'
import Game from './components/Game'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 class="text-3xl font-bold underline">
      <Game></Game>
  </h1>
    </>
  )
}

export default App
