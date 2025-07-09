"use client"

import type React from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/breadcrumb"
import type { TransactionDetails } from "@/types/payment"

const TransactionDetailsPage: React.FC = () => {
  const transactionData: TransactionDetails = {
    id: "213SHAUDJ382713HS",
    paymentDate: "Mar 15, 2025 12:50 PM",
    paymentMethod: "Credit Card",
    totalPayment: 1350,
    category: "Data Science",
    courseName: "Machine Learning with Python: From Basics to Deployment",
    studentName: "Ahmad Husain",
    status: "success",
  }

  const handleDownloadInvoice = () => {
    console.log("Download invoice for transaction:", transactionData.id)
    // Implement invoice download logic
  }

  const breadcrumbItems = [
    { label: "Payment", href: "/payment-management" },
    { label: "Transactions Details", active: true },
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Transactions Details</h1>
      </div>

      {/* Invoice Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {/* Invoice Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Invoice</h2>
            <p className="text-lg text-gray-600">{transactionData.id}</p>
          </div>
          <Badge className="bg-green-100 text-green-800 px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            Payment Success
          </Badge>
        </div>

        {/* Invoice Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Date</h3>
              <p className="text-base text-gray-900">{transactionData.paymentDate}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h3>
              <p className="text-base text-gray-900">{transactionData.paymentMethod}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Payment</h3>
              <p className="text-base font-semibold text-gray-900">₹{transactionData.totalPayment}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
              <p className="text-base text-gray-900">{transactionData.category}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Course Name</h3>
              <p className="text-base text-gray-900">{transactionData.courseName}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Student Name</h3>
              <p className="text-base text-gray-900">{transactionData.studentName}</p>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-end">
          <Button onClick={handleDownloadInvoice} className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3">
            <Download className="w-4 h-4 mr-2" />
            Download Invoice
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TransactionDetailsPage
