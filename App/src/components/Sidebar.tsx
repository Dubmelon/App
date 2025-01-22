import React from "react"
import { NavLink } from "react-router-dom"
import { HomeIcon, CreditCardIcon, ChartPieIcon, TrendingUpIcon, FlagIcon } from "@heroicons/react/outline"

const Sidebar = () => {
  const navigation = [
    { name: "Dashboard", icon: HomeIcon, href: "/" },
    { name: "Transactions", icon: CreditCardIcon, href: "/transactions" },
    { name: "Budget", icon: ChartPieIcon, href: "/budget" },
    { name: "Investments", icon: TrendingUpIcon, href: "/investments" },
    { name: "Goals", icon: FlagIcon, href: "/goals" },
  ]

  return (
    <div className="flex flex-col w-64 bg-gray-800">
      <div className="flex items-center justify-center h-20 shadow-md">
        <h1 className="text-3xl uppercase text-white">Finance App</h1>
      </div>
      <nav className="flex-grow">
        <ul className="flex flex-col py-4">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-6 py-2 mt-3 transition-colors duration-300 transform ${
                    isActive ? "bg-gray-700 text-gray-100" : "text-gray-400 hover:bg-gray-700 hover:text-gray-100"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="mx-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar

