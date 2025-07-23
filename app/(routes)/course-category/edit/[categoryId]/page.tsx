import { Category } from "@/lib/generated/prisma";
import EditCategory from "./_components/edit-category";

interface CategoryEditPageProps {
  params: Promise<{ categoryId: string }>;
}

export default async function CategoryEditPage({ params }: CategoryEditPageProps) {
  const { categoryId } = await params;

  if (!categoryId) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-600">Error: Category ID is required</p>
        </div>
      </div>
    );
  }

  try {
    const res = await fetch(`http://localhost:3000/api/course-category/${categoryId}`, {
      cache: "no-store",
    });
    const json: { success: boolean; data: Category; error?: string } = await res.json();

    if (!json.success) {
      return (
        <div className="min-h-screen bg-white p-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-red-600">Error: {json.error || "Failed to fetch category"}</p>
          </div>
        </div>
      );
    }

    return <EditCategory category={json.data} categoryId={categoryId} />;
  } catch (err) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-600">
            Error: {err instanceof Error ? err.message : "Failed to fetch category"}
          </p>
        </div>
      </div>
    );
  }
}