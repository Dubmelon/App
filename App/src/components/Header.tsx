import React from "react"
import { useLocation } from "react-router-dom"

const Header = () => {
  const location = useLocation()
  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case "/":
        return "Dashboard"
      case "/transactions":
        return "Transactions"
      case "/budget":
        return "Budget"
      case "/investments":
        return "Investments"
      case "/goals":
        return "Financial Goals"
      default:
        return "Financial Dashboard"
    }
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">{getPageTitle(location.pathname)}</h1>
      </div>
    </header>
  )
}

export default Header

