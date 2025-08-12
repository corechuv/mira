import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import Toaster from '@/components/Toaster'
import RuntimeErrorOverlay from '@/components/RuntimeErrorOverlay'

export default function App() {
  return (<>
  <RuntimeErrorOverlay />

    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
    </>
)}