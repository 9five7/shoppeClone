import { useContext, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppContext } from './context/app.context'
import useRouteElements from './useRouteElements'
import { localStorageEventTarget } from './utils/auth'
function App() {
  const routeElements = useRouteElements()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    localStorageEventTarget.addEventListener('clearLS', reset)
    return () => {
      localStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])
  return (
    <div>
      {routeElements}
      <ToastContainer />
    </div>
  )
}

export default App
