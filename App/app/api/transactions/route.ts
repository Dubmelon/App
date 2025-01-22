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
  const limit = Number(searchParams.get("limit")) || 10
  const page = Number(searchParams.get("page")) || 1
  const skip = (page - 1) * limit

  try {
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId: session.user.id },
        orderBy: { date: "desc" },
        take: limit,
        skip: skip,
      }),
      prisma.transaction.count({ where: { userId: session.user.id } }),
    ])

    return NextResponse.json({
      transactions,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Unable to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { date, description, amount, category, accountId, type } = body

    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(date),
        description,
        amount: Number.parseFloat(amount),
        category,
        type,
        accountId,
        userId: session.user.id,
      },
    })

    // Update account balance
    await prisma.account.update({
      where: { id: accountId },
      data: { balance: { increment: Number.parseFloat(amount) } },
    })

    return NextResponse.json(transaction)
  } catch (error) {
    return NextResponse.json({ error: "Unable to create transaction" }, { status: 500 })
  }
}

