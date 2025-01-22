import React from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "../services/api"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const Dashboard = () => {
  const { data: balances, isLoading: isLoadingBalances } = useQuery({
    queryKey: ["balances"],
    queryFn: api.fetchBalances,
  })

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: api.fetchTransactions,
  })

  const chartData = {
    labels: balances?.map((account) => account.accountName) || [],
    datasets: [
      {
        label: "Account Balances",
        data: balances?.map((account) => account.balance) || [],
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"],
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Account Balances",
      },
    },
  }

  if (isLoadingBalances || isLoadingTransactions) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {balances?.map((account) => (
          <div key={account.accountName} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{account.accountName}</h3>
            <p className="text-2xl font-bold">${account.balance.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Date</th>
              <th className="text-left">Description</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.slice(0, 5).map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td className={`text-right ${transaction.amount < 0 ? "text-red-500" : "text-green-500"}`}>
                  ${Math.abs(transaction.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard

