"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme="dark"
      position="top-right"
      richColors
      closeButton
      duration={4000}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#201a2c]/95 group-[.toaster]:text-white group-[.toaster]:border-white/20 group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-md",
          description: "group-[.toast]:text-gray-300",
          actionButton:
            "group-[.toast]:bg-gradient-to-r group-[.toast]:from-purple-500 group-[.toast]:to-pink-500 group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-gray-600 group-[.toast]:text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
