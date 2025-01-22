import axios from "axios"

const API_BASE_URL = "https://api.example.com" // Replace with your actual API base URL

export const api = {
  async fetchBalances() {
    try {
      const response = await axios.get(`${API_BASE_URL}/balances`)
      return response.data
    } catch (error) {
      console.error("Error fetching balances:", error)
      throw error
    }
  },

  async fetchTransactions() {
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions`)
      return response.data
    } catch (error) {
      console.error("Error fetching transactions:", error)
      throw error
    }
  },

  async fetchBudgets() {
    try {
      const response = await axios.get(`${API_BASE_URL}/budgets`)
      return response.data
    } catch (error) {
      console.error("Error fetching budgets:", error)
      throw error
    }
  },

  async fetchInvestments() {
    try {
      const response = await axios.get(`${API_BASE_URL}/investments`)
      return response.data
    } catch (error) {
      console.error("Error fetching investments:", error)
      throw error
    }
  },

  async fetchGoals() {
    try {
      const response = await axios.get(`${API_BASE_URL}/goals`)
      return response.data
    } catch (error) {
      console.error("Error fetching goals:", error)
      throw error
    }
  },

  async createTransaction(transactionData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/transactions`, transactionData)
      return response.data
    } catch (error) {
      console.error("Error creating transaction:", error)
      throw error
    }
  },

  async updateBudget(budgetId, budgetData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/budgets/${budgetId}`, budgetData)
      return response.data
    } catch (error) {
      console.error("Error updating budget:", error)
      throw error
    }
  },

  async createGoal(goalData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/goals`, goalData)
      return response.data
    } catch (error) {
      console.error("Error creating goal:", error)
      throw error
    }
  },
}

