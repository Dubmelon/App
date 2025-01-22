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
    const accounts = await prisma.account.findMany({
      where: { userId: session.user.id },
      select: { name: true, balance: true, type: true },
    })
    return NextResponse.json(accounts)
  } catch (error) {
    return NextResponse.json({ error: "Unable to fetch account balances" }, { status: 500 })
  }
}

