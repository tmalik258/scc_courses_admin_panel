import { DashedSpinner } from "@/components/dashed-spinner";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CourseWithRelations } from "@/types/course";
import { randomColorGenerator } from "@/utils/category";
import { fetchImage } from "@/utils/supabase/fetchImage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { formatDistanceToNow } from "date-fns";
import { CircleAlertIcon, Clock, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CourseCardProps {
  course: CourseWithRelations;
  handleDelete: (courseId: string) => void;
  handleEdit: (courseId: string) => void;
}

const CourseCard = ({ course, handleDelete, handleEdit }: CourseCardProps) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("");

  useEffect(() => {
    (async () => {
      if (
        !thumbnailUrl &&
        course?.thumbnailUrl &&
        course.thumbnailUrl !== null
      ) {
        setThumbnailUrl(
          await fetchImage(course.thumbnailUrl)
            .then((res) => {
              setLoading(true);
              return res;
            })
            .finally(() => setLoading(false))
        );
      }
    })();
  }, [course.thumbnailUrl, thumbnailUrl]);

  useEffect(() => {
    if (!color) setColor(randomColorGenerator());
  }, [color]);

  return (
    <Card key={course.id} className="overflow-hidden border-0 shadow-sm">
      <div className="relative">
        {/* Course Image with Gradient Background */}
        <div className="flex items-center justify-center relative px-5">
          {loading ? (
            <div className="w-full h-56 flex items-center justify-center">
              <DashedSpinner size={24} />
            </div>
          ) : (
            <Image
              width={200}
              height={200}
              decoding="async"
              src={thumbnailUrl || "/images/course_placeholder.jpg"}
              alt={course.title}
              className="w-full h-56 object-cover rounded-xl"
            />
          )}
          {/* Category Badge */}
          <div className="absolute top-2 left-7 z-20">
            <Badge
              className={`text-xs font-medium px-2 py-1 ${
                color || "bg-gray-100 text-gray-700"
              }`}
            >
              {course.category.name}
            </Badge>
          </div>
          {/* Edited Time */}
          <div className="absolute top-2 right-7 flex items-center text-white text-xs bg-black/20 rounded-full px-2 py-1">
            <Clock className="w-3 h-3 mr-1" />
            Edited{" "}
            {formatDistanceToNow(new Date(course.updatedAt), {
              addSuffix: true,
            })}
          </div>
        </div>
      </div>

      <CardContent className="px-5 flex flex-col justify-between h-full">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2 text-base leading-tight">
            {course.title}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {course.instructor.fullName || "Unknown"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-sky-500 border-sky-500 hover:bg-sky-50 bg-white cursor-pointer"
            onClick={() => handleEdit(course.id)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-red-500 border-red-500 hover:bg-red-50 bg-white cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                  aria-hidden="true"
                >
                  <CircleAlertIcon className="opacity-80" size={16} />
                </div>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this course? All associated
                    modules, lessons, and resources will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(course.id)}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
