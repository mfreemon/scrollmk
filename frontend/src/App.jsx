import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import PostingCalendar from './Components/PostingCalendar'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <PostingCalendar />
    </>
  )
}

export default App
