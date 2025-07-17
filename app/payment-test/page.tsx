"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const PaymentTestPage = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleTestPayment = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: "69cdaba5-3393-4c86-81d9-65b4fcc9b8ff", // example: "9a1b2c3d-4e5f-6789-abcd-1234567890ef"
          courseId: "REPLACE_WITH_VALID_UUID",
          paymentMethod: "Credit Card",
          totalAmount: 1350,
          courseName: "Machine Learning with Python: From Basics to Deployment",
          studentName: "Ahmad Husain",
          category: "Data Science",
        }),
      });

      const data = await res.json();
      setResponse(data);
      console.log("API Response:", data);
    } catch (err) {
      console.error("Payment test failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Test Payment API</h1>
      <Button onClick={handleTestPayment} disabled={loading}>
        {loading ? "Processing..." : "Send Payment Request"}
      </Button>

      {response && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PaymentTestPage;
