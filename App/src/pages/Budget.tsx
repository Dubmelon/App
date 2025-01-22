import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../services/api"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

const Budget = () => {
  const queryClient = useQueryClient()
  const [editingBudget, setEditingBudget] = useState(null)
  const [newLimit, setNewLimit] = useState("")

  const { data: budgets, isLoading } = useQuery({
    queryKey: ["budgets"],
    queryFn: api.fetchBudgets,
  })

  const updateBudgetMutation = useMutation({
    mutationFn: ({ budgetId, budgetData }) => api.updateBudget(budgetId, budgetData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] })
      setEditingBudget(null)
      setNewLimit("")
    },
  })

  const handleEditBudget = (budget) => {
    setEditingBudget(budget)
    setNewLimit(budget.limit.toString())
  }

  const handleUpdateBudget = (e) => {
    e.preventDefault()
    updateBudgetMutation.mutate({
      budgetId: editingBudget.id,
      budgetData: { ...editingBudget, limit: Number.parseFloat(newLimit) },
    })
  }

  const chartData = {
    labels: budgets?.map((budget) => budget.category) || [],
    datasets: [
      {
        data: budgets?.map((budget) => budget.spent) || [],
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

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Budget</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-xl font-semibold mb-4">Budget Overview</h3>
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Limit
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Spent
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {budgets?.map((budget) => (
                <tr key={budget.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{budget.category}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">${budget.limit.toFixed(2)}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">${budget.spent.toFixed(2)}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button onClick={() => handleEditBudget(budget)} className="text-blue-600 hover:text-blue-900">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-xl font-semibold mb-4">Budget Distribution</h3>
          <Pie data={chartData} />
        </div>
      </div>
      {editingBudget && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-xl font-semibold mb-4">Edit Budget: {editingBudget.category}</h3>
          <form onSubmit={handleUpdateBudget}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newLimit">
                New Limit
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="newLimit"
                type="number"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Update Budget
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => setEditingBudget(null)}
                type="button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Budget

