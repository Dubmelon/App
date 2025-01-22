import type React from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  HomeIcon,
  CreditCardIcon,
  ChartPieIcon,
  CurrencyDollarIcon,
  FlagIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  const navigation = [
    { name: "Dashboard", href: "/", icon: HomeIcon },
    { name: "Transactions", href: "/transactions", icon: CreditCardIcon },
    { name: "Budget", href: "/budget", icon: ChartPieIcon },
    { name: "Investments", href: "/investments", icon: CurrencyDollarIcon },
    { name: "Goals", href: "/goals", icon: FlagIcon },
  ]

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 bg-card text-card-foreground">
        <div className="flex items-center justify-center h-16 border-b">
          <h1 className="text-2xl font-bold">FinTrack</h1>
        </div>
        <nav className="mt-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-2 mt-4 duration-200 border-l-4 ${
                router.pathname === item.href
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-transparent hover:bg-primary/5"
              }`}
            >
              <item.icon className="w-5 h-5 mr-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-card text-card-foreground">
          <h2 className="text-xl font-semibold">
            {navigation.find((item) => item.href === router.pathname)?.name || "FinTrack"}
          </h2>
          <div className="flex items-center">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="ml-4">
              <Cog6ToothIcon className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="ml-4" onClick={() => signOut()}>
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default Layout

