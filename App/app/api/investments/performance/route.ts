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
    const investments = await prisma.investment.findMany({
      where: { userId: session.user.id },
      include: { transactions: true },
    })

    const totalReturns = investments.reduce((sum, investment) => {
      const investmentReturns = investment.transactions.reduce((returns, transaction) => {
        return returns + (transaction.type === "DIVIDEND" ? transaction.amount : 0)
      }, 0)
      return sum + investmentReturns
    }, 0)

    return NextResponse.json({ totalReturns })
  } catch (error) {
    return NextResponse.json({ error: "Unable to fetch investment performance" }, { status: 500 })
  }
}

