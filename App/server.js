const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())

// Mock data (replace with database interactions in a real application)
const balances = [
  { accountName: "Checking Account", balance: 2500.0 },
  { accountName: "Savings Account", balance: 15000.0 },
  { accountName: "Investment Account", balance: 35000.0 },
]

const transactions = [
  { id: 1, date: "2025-01-15", description: "Groceries", amount: -150.0, category: "Food" },
  { id: 2, date: "2025-01-14", description: "Electric Bill", amount: -75.0, category: "Utilities" },
  { id: 3, date: "2025-01-13", description: "Salary", amount: 5000.0, category: "Income" },
]

// Routes
app.get("/api/balances", (req, res) => {
  res.json(balances)
})

app.get("/api/transactions", (req, res) => {
  res.json(transactions)
})

app.post("/api/transactions", (req, res) => {
  const newTransaction = {
    id: transactions.length + 1,
    ...req.body,
  }
  transactions.push(newTransaction)
  res.status(201).json(newTransaction)
})

// Add more routes for other endpoints (budgets, investments, goals)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

