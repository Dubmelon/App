import React from "react"
import { FixedSizeList as List } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"

const VirtualizedTransactionList = ({ transactions }) => {
  const Row = ({ index, style }) => {
    const transaction = transactions[index]
    return (
      <div style={style} className="flex items-center border-b border-gray-200">
        <div className="flex-1 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(transaction.date).toLocaleDateString()}
        </div>
        <div className="flex-1 px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.description}</div>
        <div className="flex-1 px-6 py-4 whitespace-nowrap text-sm text-gray-500">${transaction.amount.toFixed(2)}</div>
        <div className="flex-1 px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.category}</div>
      </div>
    )
  }

  return (
    <div style={{ height: "400px" }}>
      <AutoSizer>
        {({ height, width }) => (
          <List height={height} itemCount={transactions.length} itemSize={35} width={width}>
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  )
}

export default VirtualizedTransactionList

