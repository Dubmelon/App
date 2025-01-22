import React, { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { io } from "socket.io-client"
import VirtualizedTransactionList from "./VirtualizedTransactionList"

// ... (previous imports and schema definition)

const Transactions = () => {
  // ... (previous state and hooks)

  useEffect(() => {
    const socket = io("", {
      path: "/api/socketio",
    })

    socket.on("connect", () => {
      console.log("Connected to WebSocket")
    })

    socket.on("transactionUpdated", (updatedTransaction) => {
      queryClient.setQueryData(["transactions"], (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          transactions: oldData.transactions.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t)),
        }
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [queryClient])

  // ... (previous query and mutation logic)

  const onSubmit = (data: TransactionFormData) => {
    addTransactionMutation.mutate(data, {
      onSuccess: (newTransaction) => {
        const socket = io("", {
          path: "/api/socketio",
        })
        socket.emit("updateTransaction", newTransaction)
      },
    })
  }

  // ... (rest of the component)
}

export default Transactions

