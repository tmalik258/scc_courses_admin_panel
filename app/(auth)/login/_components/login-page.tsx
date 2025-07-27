"use client";

import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import { LoginForm } from "./login-form";

const LoginPage = () => {
  const searchParams = useSearchParams();

  const error = searchParams.get("error");
  const success = searchParams.get("success");

  useEffect(() => {
    if (error) {
      // Decode the error message
      const decodedError = decodeURIComponent(error);
      console.error("Login error:", decodedError);
      toast.error(`Login failed: ${decodedError}`);
    }
    if (success) {
      // Decode the success message (if needed)
      const decodedSuccess = decodeURIComponent(success);
      toast.success(`Login successful: ${decodedSuccess}`);
    }
  }, [error, success]);

  return <LoginForm />;
};

export default LoginPage;
