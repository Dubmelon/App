import type React from "react"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../services/api"

const Goals = () => {
  const queryClient = useQueryClient()
  const [newGoal, setNewGoal] = useState({
    goal: "",
    target: "",
    saved: "",
    deadline: "",
  })

  const { data: goals, isLoading } = useQuery({
    queryKey: ["goals"],
    queryFn: api.fetchGoals,
  })

  const addGoalMutation = useMutation({
    mutationFn: api.createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] })
      setNewGoal({ goal: "", target: "", saved: "", deadline: "" })
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewGoal((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addGoalMutation.mutate({
      ...newGoal,
      target: Number.parseFloat(newGoal.target),
      saved: Number.parseFloat(newGoal.saved),
    })
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Financial Goals</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4 flex flex-wrap -mx-3">
          <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="goal">
              Goal
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="goal"
              type="text"
              name="goal"
              value={newGoal.goal}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="w-full md:w-1/4 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="target">
              Target Amount
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="target"
              type="number"
              name="target"
              value={newGoal.target}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="w-full md:w-1/4 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="saved">
              Saved Amount
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="saved"
              type="number"
              name="saved"
              value={newGoal.saved}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="w-full md:w-1/4 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="deadline">
              Deadline
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="deadline"
              type="date"
              name="deadline"
              value={newGoal.deadline}
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
            Add Goal
          </button>
        </div>
      </form>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-semibold mb-4">Your Financial Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals?.map((goal) => (
            <div key={goal.goal} className="bg-gray-100 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2">{goal.goal}</h4>
              <p className="text-sm text-gray-600 mb-1">Target: ${goal.target.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mb-1">Saved: ${goal.saved.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mb-2">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(goal.saved / goal.target) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Progress: {((goal.saved / goal.target) * 100).toFixed(2)}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Goals

