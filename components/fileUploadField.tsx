import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/utils/supabase/uploadFile";

interface FileUploadFieldProps {
  value?: string;
  onChange: (fileUrl: string | undefined) => void;
  label?: string;
  disabled?: boolean;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  value,
  onChange,
  label = "File",
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
      const url = await uploadFile(file);
      onChange(url);
      toast.success("File uploaded successfully");
      setFile(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const remove = () => {
    onChange(undefined);
    setFile(null);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
        <CardContent className="p-4 space-y-4">
          {value && !file ? (
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <FileText className="text-green-600" />
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {value}
                </a>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={remove}
                className="text-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <input
                type="file"
                onChange={handleChange}
                disabled={disabled || isUploading}
              />
              {file && (
                <div className="flex justify-between items-center">
                  <span>{file.name}</span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleUpload}
                      disabled={disabled || isUploading}
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
                      onClick={remove}
                      className="text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
