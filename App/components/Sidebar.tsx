import { useState } from "react"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="p-4">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className={`${isOpen ? "block" : "hidden"} md:block md:w-64 bg-gray-800 text-white`}>
        {/* Sidebar content */}
      </div>
    </>
  )
}

export default Sidebar

