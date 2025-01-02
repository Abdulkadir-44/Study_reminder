
import { BrowserRouter as Router } from "react-router-dom"
import AppRouter from "./routes/AppRouter"
import { Toaster } from "sonner"
function App() {

  return (
    <>
      <Toaster
        duration={1500}
        position='top-center'
        className='mt-8'
        richColors />
      <AppRouter />
    </>
  )
}

export default App
