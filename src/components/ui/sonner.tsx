"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme="light"
      position="top-right"
      richColors
      closeButton
      duration={4000}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-xl group-[.toaster]:backdrop-blur-md group-[.toaster]:rounded-lg",
          description: "group-[.toast]:text-gray-600 group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-purple-900 group-[.toast]:text-white group-[.toast]:hover:bg-purple-800 group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1 group-[.toast]:text-sm",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700 group-[.toast]:hover:bg-gray-200 group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1 group-[.toast]:text-sm",
          success:
            "group-[.toast]:bg-green-50 group-[.toast]:border-green-200 group-[.toast]:text-green-800",
          error:
            "group-[.toast]:bg-red-50 group-[.toast]:border-red-200 group-[.toast]:text-red-800",
          warning:
            "group-[.toast]:bg-yellow-50 group-[.toast]:border-yellow-200 group-[.toast]:text-yellow-800",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
