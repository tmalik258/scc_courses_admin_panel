"use client"

import type React from "react"
import { useState } from "react"
import { Search, Eye, Trash2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Breadcrumb } from "@/components/breadcrumb"
import type { Transaction } from "@/types/payment"
import { useRouter } from "nextjs-toploader/app"

const PaymentManagementPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Category")
  const [sortBy, setSortBy] = useState("Recently")
  const router = useRouter();

  // Mock transaction data
  const transactions: Transaction[] = [
    {
      id: "67775F553",
      date: "11-04-2025",
      studentName: "Ahmad Husain",
      totalPayment: 1350,
      status: "success",
    },
    {
      id: "67775F553",
      date: "11-04-2025",
      studentName: "Ahmad Husain",
      totalPayment: 1350,
      status: "success",
    },
    {
      id: "67775F553",
      date: "11-04-2025",
      studentName: "Ahmad Husain",
      totalPayment: 1350,
      status: "success",
    },
    {
      id: "67775F553",
      date: "11-04-2025",
      studentName: "Ahmad Husain",
      totalPayment: 1350,
      status: "success",
    },
    {
      id: "67775F553",
      date: "11-04-2025",
      studentName: "Ahmad Husain",
      totalPayment: 1350,
      status: "failed",
    },
    {
      id: "67775F553",
      date: "11-04-2025",
      studentName: "Ahmad Husain",
      totalPayment: 1350,
      status: "failed",
    },
    {
      id: "67775F553",
      date: "11-04-2025",
      studentName: "Ahmad Husain",
      totalPayment: 1350,
      status: "success",
    },
    {
      id: "67775F553",
      date: "11-04-2025",
      studentName: "Ahmad Husain",
      totalPayment: 1350,
      status: "failed",
    },
    {
      id: "67775F553",
      date: "11-04-2025",
      studentName: "Ahmad Husain",
      totalPayment: 1350,
      status: "pending",
    },
  ]

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleView = (transactionId: string) => {
    console.log("View transaction:", transactionId)
    // Navigate to transaction details page
    router.push(`/payment-management/${transactionId}`);
  }

  const handleDelete = (transactionId: string) => {
    console.log("Delete transaction:", transactionId)
  }

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-100 text-green-800">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            Success
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
            Failed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Payment Management", active: true },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            All Transactions <span className="text-sky-500">({transactions.length})</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80 bg-gray-50 border-gray-200"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100">
                {selectedCategory}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedCategory("All Category")}>All Category</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory("Success")}>Success</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory("Failed")}>Failed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory("Pending")}>Pending</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100">
                {sortBy}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("Recently")}>Recently</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("Oldest")}>Oldest</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("Amount High")}>Amount High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("Amount Low")}>Amount Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>Transaction ID</span>
                    <div className="flex flex-col">
                      <button className="text-gray-400 hover:text-gray-600">▲</button>
                      <button className="text-gray-400 hover:text-gray-600">▼</button>
                    </div>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>Student Name</span>
                    <div className="flex flex-col">
                      <button className="text-gray-400 hover:text-gray-600">▲</button>
                      <button className="text-gray-400 hover:text-gray-600">▼</button>
                    </div>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction, index) => (
                <tr key={`${transaction.id}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.studentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{transaction.totalPayment}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(transaction.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(transaction.id)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg cursor-pointer"
                        title="View transaction"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No transactions found</div>
          <div className="text-gray-400">Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  )
}

export default PaymentManagementPage
