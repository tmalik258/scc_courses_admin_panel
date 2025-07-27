import { createClient } from "./client";

const supabase = createClient();

export const fetchImage = async (imageUrl: string): Promise<string | null> => {
  try {
    if (!imageUrl) {
      console.error("No image URL provided");
      return null;
    }

    // Extract the file path from the public URL
    const filePath = imageUrl.split('/storage/v1/object/public/courses-resources/')[1];
    if (!filePath) {
      console.error("Invalid image URL format:", imageUrl);
      return null;
    }

    console.log("Fetching signed URL for file path:", filePath);

    // Generate signed URL for the uploaded image
    const { data, error } = await supabase.storage
      .from('courses-resources')
      .createSignedUrl(filePath, 60); // URL valid for 60 seconds

    if (error) {
      console.error("Error generating signed URL:", error);
      return null;
    }

    const uploadedUrl = data.signedUrl;
    console.log("Signed URL:", uploadedUrl);

    return uploadedUrl;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};