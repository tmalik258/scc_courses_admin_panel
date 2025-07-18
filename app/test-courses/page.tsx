"use client";

import React, { useState } from "react";

// Define types matching the API
interface Section {
  name: string;
  reading?: string | null;
  videoUrl?: string | null;
}

interface Module {
  title: string;
  sections: Section[];
}

interface Resource {
  title: string;
  url: string;
}

interface CourseFormData {
  title: string;
  description?: string | null;
  category: string;
  price?: string | null;
  instructor: string;
  thumbnail?: string | null;
  modules: Module[];
  resources: Resource[];
}

interface CourseResponse {
  id: string;
  title: string;
  description?: string | null;
  categoryId: string;
  instructorId: string;
  price?: string | null;
  thumbnailUrl?: string | null;
  modules: Array<{
    id: string;
    title: string;
    sections: Array<{
      id: string;
      name: string;
      reading?: string | null;
      videoUrl?: string | null;
    }>;
  }>;
  resources: Array<{
    id: string;
    title: string;
    url: string;
  }>;
  instructor: {
    id: string;
    name?: string | null;
  };
  category: {
    id: string;
    name: string;
  };
}

interface ApiSuccessResponse {
  success: true;
  course: CourseResponse;
}

interface ApiErrorResponse {
  error: string;
  details?: string;
}

export default function TestCoursesPage() {
  const [postResponse, setPostResponse] = useState<ApiSuccessResponse | null>(
    null
  );
  const [postError, setPostError] = useState<string | null>(null);
  const [getResponse, setGetResponse] = useState<CourseResponse[] | null>(null);
  const [getError, setGetError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTestPost = async () => {
    setLoading(true);
    setPostResponse(null);
    setPostError(null);

    const payload: CourseFormData = {
      title: "Introduction to Physics",
      description: "A beginner's guide to physics concepts.",
      category: "category-1",
      price: "99.99",
      instructor: "instructor-1",
      thumbnail: "https://example.com/thumbnail.jpg",
      modules: [
        {
          title: "Mechanics",
          sections: [
            {
              name: "Kinematics",
              reading: "Chapter 1",
              videoUrl: "https://example.com/kinematics.mp4",
            },
            { name: "Dynamics", reading: "Chapter 2", videoUrl: null },
          ],
        },
      ],
      resources: [
        { title: "Physics Textbook", url: "https://example.com/textbook.pdf" },
      ],
    };

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log(
        "[TEST_COURSES_POST] Response status:",
        res.status,
        res.statusText
      );
      const text = await res.text();
      console.log("[TEST_COURSES_POST] Raw response:", text.slice(0, 200));
      try {
        const data = JSON.parse(text) as ApiSuccessResponse | ApiErrorResponse;
        console.log("[TEST_COURSES_POST] Parsed response:", data);
        if (!res.ok) {
          setPostError(JSON.stringify(data, null, 2));
        } else {
          setPostResponse(data as ApiSuccessResponse);
        }
      } catch (parseErr: unknown) {
        const errorMessage =
          parseErr instanceof Error ? parseErr.message : "Unknown parse error";
        setPostError(
          `Non-JSON response received (status: ${res.status} ${
            res.statusText
          }):\n${text.slice(0, 200)}...\nParse error: ${errorMessage}`
        );
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setPostError(`Failed to fetch: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestGet = async () => {
    setLoading(true);
    setGetResponse(null);
    setGetError(null);

    try {
      const res = await fetch("/api/courses", {
        method: "GET",
      });

      console.log(
        "[TEST_COURSES_GET] Response status:",
        res.status,
        res.statusText
      );
      const text = await res.text();
      console.log("[TEST_COURSES_GET] Raw response:", text.slice(0, 200));
      try {
        const data = JSON.parse(text) as CourseResponse[] | ApiErrorResponse;
        console.log("[TEST_COURSES_GET] Parsed response:", data);
        if (!res.ok) {
          setGetError(JSON.stringify(data, null, 2));
        } else {
          setGetResponse(data as CourseResponse[]);
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
      <h1>Test Courses API</h1>
      <div>
        <button onClick={handleTestPost} disabled={loading}>
          {loading ? "Sending..." : "Send Test POST"}
        </button>
        <button
          onClick={handleTestGet}
          disabled={loading}
          style={{ marginLeft: "10px" }}
        >
          {loading ? "Fetching..." : "Send Test GET"}
        </button>
      </div>
      {postResponse && (
        <div>
          <h2>POST Response</h2>
          <pre>{JSON.stringify(postResponse, null, 2)}</pre>
        </div>
      )}
      {postError && (
        <div>
          <h2>POST Error</h2>
          <pre style={{ color: "red" }}>{postError}</pre>
        </div>
      )}
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
