import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/utils/supabase/uploadFile";

interface FileUploadFieldProps {
  value?: string;
  folderName: string;
  onChange: (fileUrl: string | undefined) => void;
  label?: string;
  disabled?: boolean;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  value,
  folderName,
  onChange,
  label,
  disabled = false,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setIsUploading(true);
      toast.info("Uploading file...");
      const url = await uploadFile(file, folderName);
      onChange(url);
      toast.success("File uploaded successfully!");
      setFile(null);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        toast.error(err.message || "Upload failed");
      } else {
        toast.error("Upload failed");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const remove = () => {
    onChange(undefined);
    setFile(null);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {label}
      </Label>
      <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden transition-all hover:border-gray-400 dark:hover:border-gray-600">
        <CardContent className="space-y-6">
          {value && !file ? (
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-green-500 dark:text-green-400" />
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 text-sm underline truncate max-w-xs hover:text-blue-700 dark:hover:text-blue-300"
                >
                  {value}
                </a>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={remove}
                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                disabled={disabled || isUploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  data-disabled={disabled || isUploading}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Supported formats: PDF, DOC, MP4 (max 10MB)
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    disabled={disabled || isUploading}
                  />
                </label>
              </div>
              {file && (
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">
                    {file.name}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleUpload}
                      disabled={disabled || isUploading}
                      className="bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300 cursor-pointer"
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
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
                      onClick={remove}
                      className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      disabled={disabled || isUploading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};