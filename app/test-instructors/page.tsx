"use client";

import React, { useState } from "react";

// Define types matching the Prisma schema
interface Course {
  id: string;
  title: string;
  description?: string | null;
  instructorId: string;
  categoryId: string;
  thumbnailUrl?: string | null;
  price?: number | null;
  isPublished: boolean;
}

interface Profile {
  id: string;
  name?: string | null;
  role: string;
  instructorCourses: Course[];
}

interface ApiErrorResponse {
  error: string;
  details?: string;
}

export default function TestInstructorsPage() {
  const [getResponse, setGetResponse] = useState<Profile[] | null>(null);
  const [getError, setGetError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTestGet = async () => {
    setLoading(true);
    setGetResponse(null);
    setGetError(null);

    try {
      const res = await fetch("/api/instructors", {
        method: "GET",
      });

      console.log(
        "[TEST_INSTRUCTORS_GET] Response status:",
        res.status,
        res.statusText
      );
      const text = await res.text();
      console.log("[TEST_INSTRUCTORS_GET] Raw response:", text.slice(0, 200));
      try {
        const data = JSON.parse(text) as Profile[] | ApiErrorResponse;
        console.log("[TEST_INSTRUCTORS_GET] Parsed response:", data);
        if (!res.ok) {
          setGetError(JSON.stringify(data, null, 2));
        } else {
          setGetResponse(data as Profile[]);
        }
      } catch (parseErr: unknown) {
        const errorMessage =
          parseErr instanceof Error ? parseErr.message : "Unknown parse error";
        setGetError(
          `Non-JSON response received (status: ${res.status} ${
            res.statusText
          }):\n${text.slice(0, 200)}...\nParse error: ${errorMessage}`
        );
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setGetError(`Failed to fetch: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Instructors API</h1>
      <div>
        <button onClick={handleTestGet} disabled={loading}>
          {loading ? "Fetching..." : "Send Test GET"}
        </button>
      </div>
      {getResponse && (
        <div>
          <h2>GET Response</h2>
          <pre>{JSON.stringify(getResponse, null, 2)}</pre>
        </div>
      )}
      {getError && (
        <div>
          <h2>GET Error</h2>
          <pre style={{ color: "red" }}>{getError}</pre>
        </div>
      )}
    </div>
  );
}
