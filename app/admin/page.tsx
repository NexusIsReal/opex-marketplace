"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to dashboard as the main admin page
    router.push("/admin/dashboard");
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="text-white text-center">
        <h1 className="text-2xl font-bold mb-2">Redirecting to Admin Dashboard...</h1>
        <p>Please wait</p>
      </div>
    </div>
  );
}
