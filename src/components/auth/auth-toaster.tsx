"use client";

import { Toaster } from "sonner";

export function AuthToaster() {
  return (
    <Toaster
      position="top-right"
      richColors={false}
      theme="dark"
      toastOptions={{
        style: {
          background: "rgba(0, 0, 0, 0.95)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "white",
          backdropFilter: "blur(10px)",
        },
      }}
    />
  );
}
