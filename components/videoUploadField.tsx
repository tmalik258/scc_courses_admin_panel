import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Video, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadVideo } from "@/utils/supabase/uploadVideo";

interface VideoUploadFieldProps {
  value?: string; // Current video URL
  onChange: (videoUrl: string | undefined) => void;
  label?: string;
  disabled?: boolean;
}

export const VideoUploadField: React.FC<VideoUploadFieldProps> = ({
  value,
  onChange,
  label = "",
  disabled = false,
}) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);

    if (file) {
      // Create preview URL for video
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
    } else {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
      setVideoPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!videoFile) return;

    try {
      setIsUploading(true);
      toast.info("Uploading video... This may take a moment");

      const videoUrl = await uploadVideo(videoFile);
      if (videoUrl) {
        onChange(videoUrl);
        toast.success("Video uploaded successfully");

        // Clean up preview
        if (videoPreview) {
          URL.revokeObjectURL(videoPreview);
        }
        setVideoFile(null);
        setVideoPreview(null);
      } else {
        toast.error("Video upload failed");
      }
    } catch (error) {
      console.error("Video upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Video upload failed"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview(null);
    onChange(undefined);
  };

  const removeUploadedVideo = () => {
    onChange(undefined);
  };

  // Show uploaded video URL
  if (value && !videoFile) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <Card className="border border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Video className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800">Video uploaded</p>
                  <p className="text-sm text-green-600 truncate max-w-64">
                    {value}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeUploadedVideo}
                disabled={disabled}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <video
              src={value}
              controls
              className="w-full max-h-32 rounded-lg mt-3"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          {!videoFile ? (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
              <div className="p-4 bg-blue-50 rounded-full">
                <Video className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                    disabled={disabled || isUploading}
                  />
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
                    <Upload className="w-4 h-4" />
                    Choose Video
                  </div>
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: MP4, WebM, OGG, AVI, MOV
                </p>
                <p className="text-sm text-gray-500">Max file size: 100MB</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">{videoFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleUpload}
                    disabled={disabled || isUploading}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeVideo}
                    disabled={disabled || isUploading}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {videoPreview && (
                <video
                  src={videoPreview}
                  controls
                  className="w-full max-h-48 rounded-lg"
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
