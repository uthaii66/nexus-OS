import { RouterProvider } from "react-router-dom"
import { LoadingSkeleton } from "@/components/common/loading-skeleton"
import { router } from "@/app/router"

export function App() {
  return <RouterProvider router={router} fallbackElement={<div className="mx-auto max-w-[1500px] p-6"><LoadingSkeleton /></div>} />
}

export default App
