import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Transactions from "../components/Transactions"
import axios from "axios"

jest.mock("axios")

const mockTransactions = [
  { id: 1, date: "2023-05-01", description: "Groceries", amount: 50.0, category: "Food" },
  { id: 2, date: "2023-05-02", description: "Gas", amount: 30.0, category: "Transportation" },
]

const mockPagination = {
  page: 1,
  limit: 10,
  total: 2,
  totalPages: 1,
}

describe("Transactions", () => {
  let queryClient

  beforeEach(() => {
    queryClient = new QueryClient()
    axios.get.mockResolvedValue({ data: { transactions: mockTransactions, pagination: mockPagination } })
  })

  it("renders transactions", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Transactions />
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText("Groceries")).toBeInTheDocument()
      expect(screen.getByText("Gas")).toBeInTheDocument()
    })
  })

  it("adds a new transaction", async () => {
    axios.post.mockResolvedValue({
      data: { id: 3, date: "2023-05-03", description: "Rent", amount: 1000.0, category: "Housing" },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <Transactions />
      </QueryClientProvider>,
    )

    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "Rent" } })
    fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "1000" } })
    fireEvent.change(screen.getByLabelText("Date"), { target: { value: "2023-05-03" } })
    fireEvent.change(screen.getByLabelText("Category"), { target: { value: "Housing" } })

    fireEvent.click(screen.getByText("Add Transaction"))

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/transactions", {
        description: "Rent",
        amount: 1000,
        date: "2023-05-03",
        category: "Housing",
      })
    })
  })
})

