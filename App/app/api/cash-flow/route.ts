import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") || "month"

  try {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(1) // Start from the beginning of the current month

    if (period === "year") {
      startDate.setMonth(startDate.getMonth() - 11) // Go back 11 months for a full year
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "asc" },
    })

    const cashFlow = transactions.reduce((acc, transaction) => {
      const date = transaction.date.toISOString().split("T")[0] // Get YYYY-MM-DD
      if (!acc[date]) {
        acc[date] = { income: 0, expenses: 0 }
      }
      if (transaction.amount > 0) {
        acc[date].income += transaction.amount
      } else {
        acc[date].expenses += Math.abs(transaction.amount)
      }
      return acc
    }, {})

    const result = Object.entries(cashFlow).map(([date, { income, expenses }]) => ({
      date,
      income,
      expenses,
    }))

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Unable to fetch cash flow data" }, { status: 500 })
  }
}

