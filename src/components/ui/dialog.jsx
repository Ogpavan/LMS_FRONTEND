"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// Apple-style overlay: blurred, semi-transparent, subtle shadow
function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/30 backdrop-blur-md transition-all duration-200",
        className
      )}
      {...props}
    />
  );
}

// Apple-style content: rounded, glassy, shadow, subtle border
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-2xl border border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl p-8 flex flex-col gap-6 transition-all duration-200",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="absolute top-4 right-4 rounded-full bg-white/60 hover:bg-white/80 dark:bg-gray-800/70 dark:hover:bg-gray-800/90 p-2 shadow transition-all focus:outline-none"
          >
            <XIcon className="text-gray-700 dark:text-gray-200" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

// Apple-style header: center, bold, subtle
function DialogHeader({ className, ...props }) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center", className)}
      {...props}
    />
  );
}

// Apple-style footer: spaced, rounded buttons
function DialogFooter({ className, children, ...props }) {
  // Wrap children in Apple-style buttons
  const styledChildren = React.Children.map(children, (child, idx) => {
    if (!React.isValidElement(child)) return child;
    // Primary button: blue gradient, white text, shadow, rounded
    if (child.props.type === "button" && !child.props.variant) {
      return React.cloneElement(child, {
        className: cn(
          "px-6 py-2 rounded-full font-semibold shadow-md transition-all",
          "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 focus:ring-2 focus:ring-blue-400",
          child.props.className
        ),
      });
    }
    // Outline/cancel button: subtle gray, border, rounded
    if (child.props.variant === "outline") {
      return React.cloneElement(child, {
        className: cn(
          "px-6 py-2 rounded-full font-semibold border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all",
          child.props.className
        ),
      });
    }
    return child;
  });

  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-row gap-3 justify-center mt-4", className)}
      {...props}
    >
      {styledChildren}
    </div>
  );
}

// Apple-style title: bold, larger
function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-xl font-semibold text-gray-900 dark:text-white",
        className
      )}
      {...props}
    />
  );
}

// Apple-style description: subtle, center
function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-gray-600 dark:text-gray-300 text-base text-center",
        className
      )}
      {...props}
    />
  );
}

function Dialog({ ...props }) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}
function DialogTrigger({ ...props }) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}
function DialogPortal({ ...props }) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}
function DialogClose({ ...props }) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
