"use client"

import type React from "react"
import { useQuery } from "@tanstack/react-query"
import { Bar, Doughnut, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApi } from "@/hooks/useApi"
import { formatCurrency } from "@/utils/formatCurrency"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement)

const Dashboard: React.FC = () => {
  const { callApi } = useApi()

  const { data: balances } = useQuery(["balances"], () => callApi("/api/balances"))
  const { data: transactions } = useQuery(["recentTransactions"], () => callApi("/api/transactions?limit=5"))
  const { data: budgetOverview } = useQuery(["budgetOverview"], () => callApi("/api/budget/overview"))
  const { data: investmentPerformance } = useQuery(["investmentPerformance"], () =>
    callApi("/api/investments/performance"),
  )
  const { data: cashFlow } = useQuery(["cashFlow"], () => callApi("/api/cash-flow"))

  const barChartData = {
    labels: balances?.map((account) => account.name) || [],
    datasets: [
      {
        label: "Account Balances",
        data: balances?.map((account) => account.balance) || [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  }

  const doughnutChartData = {
    labels: budgetOverview?.categories.map((category) => category.name) || [],
    datasets: [
      {
        data: budgetOverview?.categories.map((category) => category.spent) || [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  }

  const cashFlowChartData = {
    labels: cashFlow?.map((entry) => entry.date) || [],
    datasets: [
      {
        label: "Income",
        data: cashFlow?.map((entry) => entry.income) || [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Expenses",
        data: cashFlow?.map((entry) => entry.expenses) || [],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(balances?.reduce((sum, account) => sum + account.balance, 0) || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(budgetOverview?.monthlyIncome || 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(budgetOverview?.monthlyExpenses || 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investment Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(investmentPerformance?.totalReturns || 0)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cash Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={cashFlowChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Category</th>
                </tr>
              </thead>
              <tbody>
                {transactions?.map((transaction) => (
                  <tr key={transaction.id} className="border-b">
                    <td className="px-4 py-2">{new Date(transaction.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{transaction.description}</td>
                    <td className={`px-4 py-2 ${transaction.amount < 0 ? "text-red-600" : "text-green-600"}`}>
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-4 py-2">{transaction.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard

