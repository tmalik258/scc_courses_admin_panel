"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Define types for the API response
interface Invoice {
  id: string;
  status: string;
  purchaseId: string;
  invoiceNumber: string;
  paymentDate: string;
  paymentMethod: string;
  totalAmount: number;
  courseName: string;
  studentName: string;
  category?: string;
}

interface ApiResponse {
  message: string;
  invoice: Invoice;
}

interface ApiError {
  error: string;
  details?: Array<{ path: string; message: string }>;
}

export default function TestPaymentPage() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTestPayment = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    const payload = {
      studentId: uuidv4(),
      courseId: uuidv4(),
      paymentMethod: "credit_card",
      totalAmount: 100.0,
      courseName: "Introduction to Calculus",
      studentName: "Jane Doe",
      category: "Mathematics",
    };

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("[TEST_PAGE] Response status:", res.status);
      const text = await res.text();
      try {
        const data = JSON.parse(text) as ApiResponse | ApiError;
        console.log("[TEST_PAGE] Parsed response:", data);
        if (!res.ok) {
          setError(JSON.stringify(data, null, 2));
        } else {
          setResponse(data as ApiResponse);
        }
      } catch (parseErr: unknown) {
        // Handle non-JSON (e.g., HTML) response
        const errorMessage =
          parseErr instanceof Error ? parseErr.message : "Unknown parse error";
        setError(
          `Non-JSON response received (status: ${res.status}):\n${text.slice(
            0,
            200
          )}...\nParse error: ${errorMessage}`
        );
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to fetch: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Payment API</h1>
      <button onClick={handleTestPayment} disabled={loading}>
        {loading ? "Sending..." : "Send Test Payment"}
      </button>
      {response && (
        <div>
          <h2>Response</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div>
          <h2>Error</h2>
          <pre style={{ color: "red" }}>{error}</pre>
        </div>
      )}
    </div>
  );
}
