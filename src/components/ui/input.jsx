import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles - Apple-inspired minimal design
        "w-full h-8 rounded border border-gray-300 bg-white/80 backdrop-blur-sm",
        "px-3 py-1 text-sm leading-tight text-gray-900",
        "placeholder:text-gray-500 placeholder:font-normal",

        // Focus states - subtle blue accent like Apple
        "focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/20",
        "transition-all duration-200 ease-in-out",

        // Hover state
        "hover:border-gray-400 hover:bg-white/90",

        // Disabled state
        "disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed",

        // Dark mode support
        "dark:bg-gray-800/50 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400",
        "dark:focus:border-blue-400 dark:focus:ring-blue-400/20 dark:focus:bg-gray-800",
        "dark:hover:border-gray-500 dark:hover:bg-gray-800/70",
        "dark:disabled:bg-gray-900 dark:disabled:border-gray-700 dark:disabled:text-gray-500",

        // File input specific styles
        "file:mr-2 file:rounded file:border-0 file:bg-blue-50 file:px-2 file:py-1",
        "file:text-xs file:font-medium file:text-blue-700 file:hover:bg-blue-100",
        "dark:file:bg-blue-900/20 dark:file:text-blue-300 dark:file:hover:bg-blue-900/30",

        // Invalid state with subtle red accent
        "aria-invalid:border-red-400 aria-invalid:ring-2 aria-invalid:ring-red-400/20",
        "dark:aria-invalid:border-red-500 dark:aria-invalid:ring-red-500/20",

        className
      )}
      {...props}
    />
  );
}

export { Input };
