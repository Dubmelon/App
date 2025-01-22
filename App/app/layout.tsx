import type React from "react"
import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Layout from "@/components/Layout"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Layout>{children}</Layout>
              <Toaster />
            </ThemeProvider>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  )
}



import './globals.css'