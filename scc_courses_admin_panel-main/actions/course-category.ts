"use client";

export async function saveCategory(data: {
  id?: string;
  name: string;
  status: "active" | "inactive";
  icon?: string;
}) {
  const payload = {
    ...(data.id ? { id: data.id } : {}),
    name: data.name,
    status: data.status,
    icon: data.icon,
  };

  const res = await fetch("/api/course-category", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error ${res.status}`);
  }
  return await res.json();
}
