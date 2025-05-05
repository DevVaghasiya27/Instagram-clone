import SignUp from './components/SignUp'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Login from './components/Login'
import Profile from './components/Profile'

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ]
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'signup',
    element: <SignUp />,
  }
])

function App() {

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
