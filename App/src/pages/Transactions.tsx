import type React from "react"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../services/api"

const Transactions = () => {
  const queryClient = useQueryClient()
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    description: "",
    amount: "",
    category: "",
  })

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: api.fetchTransactions,
  })

  const addTransactionMutation = useMutation({
    mutationFn: api.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      setNewTransaction({ date: "", description: "", amount: "", category: "" })
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewTransaction((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addTransactionMutation.mutate({
      ...newTransaction,
      amount: Number.parseFloat(newTransaction.amount),
    })
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Transactions</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4 flex flex-wrap -mx-3">
          <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="date">
              Date
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="date"
              type="date"
              name="date"
              value={newTransaction.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="w-full md:w-1/4 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="description">
              Description
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="description"
              type="text"
              name="description"
              value={newTransaction.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="w-full md:w-1/4 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="amount">
              Amount
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="amount"
              type="number"
              name="amount"
              value={newTransaction.amount}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="w-full md:w-1/4 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="category">
              Category
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="category"
              type="text"
              name="category"
              value={newTransaction.category}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Add Transaction
          </button>
        </div>
      </form>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions?.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{transaction.date}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{transaction.description}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className={`whitespace-no-wrap ${transaction.amount < 0 ? "text-red-500" : "text-green-500"}`}>
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{transaction.category}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Transactions

