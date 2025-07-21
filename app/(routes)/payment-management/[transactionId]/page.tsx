"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/breadcrumb";
import type { TransactionDetails } from "@/types/payment";
import { useRouter } from "nextjs-toploader/app";

const TransactionDetailsPage: React.FC = () => {
  const [transaction, setTransaction] = useState<TransactionDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const transactionId = params.transactionId as string;

  useEffect(() => {
    const fetchTransaction = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/payment/${transactionId}`);
        console.log(
          "Fetching transaction from:",
          `/api/payment/${transactionId}`
        );
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch transaction: ${response.status} ${response.statusText}`
          );
        }
        const { data } = await response.json();
        console.log("API response data:", data);
        setTransaction({
          id: data.id,
          invoiceNumber: data.invoiceNumber,
          paymentDate: new Date(data.paymentDate).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          paymentMethod: data.paymentMethod,
          totalPayment: data.totalAmount,
          status: data.status,
          category: data.category || "N/A",
          courseName: data.courseName,
          studentName: data.studentName,
          studentEmail: data.purchase.student.email,
          courseTitle: data.purchase.course.title,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        console.error("Fetch error:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (transactionId) {
      fetchTransaction();
    }
  }, [transactionId]);

  const handleDownloadInvoice = () => {
    if (transaction) {
      console.log("Download invoice for transaction:", transaction.id);
      // Implement invoice download logic (e.g., generate PDF)
    }
  };

  const getStatusBadge = (status: TransactionDetails["status"]) => {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge className="bg-green-100 text-green-800 px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            Payment Success
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-red-100 text-red-800 px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
            Payment Failed
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
            Payment Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Payment Management", href: "/payment-management" },
    {
      label: `Invoice ${transaction?.invoiceNumber || transactionId}`,
      active: true,
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Breadcrumb items={breadcrumbItems} />

      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/payment-management")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Transactions
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            Loading transaction details...
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="text-red-500 text-lg">Error: {error}</div>
        </div>
      )}

      {/* Invoice Card */}
      {transaction && !loading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Invoice Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Invoice
              </h2>
              <p className="text-lg text-gray-600">{transaction.id}</p>
            </div>
            {getStatusBadge(transaction.status)}
          </div>

          {/* Invoice Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Payment Date
                </h3>
                <p className="text-base text-gray-900">
                  {transaction.paymentDate}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Payment Method
                </h3>
                <p className="text-base text-gray-900">
                  {transaction.paymentMethod}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Total Payment
                </h3>
                <p className="text-base font-semibold text-gray-900">
                  ₹{transaction.totalPayment}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Category
                </h3>
                <p className="text-base text-gray-900">
                  {transaction.category}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Course Name
                </h3>
                <p className="text-base text-gray-900">
                  {transaction.courseName}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Student Name
                </h3>
                <p className="text-base text-gray-900">
                  {transaction.studentName}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Student Email
                </h3>
                <p className="text-base text-gray-900">
                  {transaction.studentEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleDownloadInvoice}
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
          </div>
        </div>
      )}

      {/* Not Found State */}
      {!loading && !error && !transaction && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">
            Transaction not found
          </div>
          <div className="text-gray-400">
            The transaction with ID {transactionId} does not exist.
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionDetailsPage;
