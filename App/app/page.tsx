import React from "react"
import type { Metadata } from "next"
import Dashboard from "@/components/Dashboard"

export const metadata: Metadata = {
  title: "Financial Dashboard",
  description: "View and manage your financial information",
}

export default function HomePage() {
  return <Dashboard />
}

