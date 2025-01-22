import React from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "../services/api"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const Investments = () => {
  const { data: investments, isLoading } = useQuery({
    queryKey: ["investments"],
    queryFn: api.fetchInvestments,
  })

  const chartData = {
    labels: investments?.map((investment) => investment.name) || [],
    datasets: [
      {
        label: "Investment Value",
        data: investments?.map((investment) => investment.value) || [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
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
        text: "Investment Portfolio",
      },
    },
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Investments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-xl font-semibold mb-4">Investment Overview</h3>
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Change
                </th>
              </tr>
            </thead>
            <tbody>
              {investments?.map((investment) => (
                <tr key={investment.name}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{investment.name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">${investment.value.toFixed(2)}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p
                      className={`whitespace-no-wrap ${investment.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                    >
                      {investment.change}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-xl font-semibold mb-4">Investment Distribution</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}

export default Investments

