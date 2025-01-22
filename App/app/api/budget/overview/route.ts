import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const currentDate = new Date()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    const [monthlyIncome, monthlyExpenses, categories] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          userId: session.user.id,
          amount: { gt: 0 },
          date: { gte: firstDayOfMonth, lte: lastDayOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId: session.user.id,
          amount: { lt: 0 },
          date: { gte: firstDayOfMonth, lte: lastDayOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.groupBy({
        by: ["category"],
        where: {
          userId: session.user.id,
          date: { gte: firstDayOfMonth, lte: lastDayOfMonth },
        },
        _sum: { amount: true },
      }),
    ])

    const budgetOverview = {
      monthlyIncome: monthlyIncome._sum.amount || 0,
      monthlyExpenses: Math.abs(monthlyExpenses._sum.amount || 0),
      categories: categories.map((category) => ({
        name: category.category,
        spent: Math.abs(category._sum.amount || 0),
      })),
    }

    return NextResponse.json(budgetOverview)
  } catch (error) {
    return NextResponse.json({ error: "Unable to fetch budget overview" }, { status: 500 })
  }
}

