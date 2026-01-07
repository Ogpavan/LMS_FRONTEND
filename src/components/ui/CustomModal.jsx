"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Overlay
function ModalOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/30 backdrop-blur-md transition-all duration-200",
        className
      )}
      {...props}
    />
  );
}

// Content
function ModalContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return (
    <DialogPrimitive.Portal>
      <ModalOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-2xl border border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl p-8 flex flex-col gap-6 transition-all duration-200",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close className="absolute top-4 right-4 rounded-full bg-white/60 hover:bg-white/80 dark:bg-gray-800/70 dark:hover:bg-gray-800/90 p-2 shadow transition-all focus:outline-none">
            <XIcon className="text-gray-700 dark:text-gray-200" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

// Header
function ModalHeader({ className, children, ...props }) {
  return (
    <div
      className={cn("flex flex-col gap-2 text-center", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Footer
function ModalFooter({ className, children, ...props }) {
  const styledChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    // Primary button style (do NOT force full width)
    if (child.props.type === "button" && !child.props.variant) {
      return React.cloneElement(child, {
        className: cn(
          "px-6 py-2 rounded-full font-semibold shadow-md transition-all inline-flex items-center justify-center",
          "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 focus:ring-2 focus:ring-blue-400",
          child.props.className
        ),
        style: { minWidth: 120 }, // Optional: set a min width for consistency
      });
    }

    // Outline button style (do NOT force full width)
    if (child.props.variant === "outline") {
      return React.cloneElement(child, {
        className: cn(
          "px-6 py-2 rounded-full font-semibold border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all inline-flex items-center justify-center",
          child.props.className
        ),
        style: { minWidth: 120 }, // Optional: set a min width for consistency
      });
    }

    return child;
  });

  return (
    <div
      className={cn("flex flex-row gap-3 justify-center mt-4", className)}
      {...props}
    >
      {styledChildren}
    </div>
  );
}

// Title
function ModalTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      className={cn(
        "text-xl font-semibold text-gray-900 dark:text-white",
        className
      )}
      {...props}
    />
  );
}

// Description
function ModalDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      className={cn(
        "text-gray-600 dark:text-gray-300 text-base text-center",
        className
      )}
      {...props}
    />
  );
}

// CustomModal component
function CustomModal({ open, onOpenChange, children }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

// Trigger
function ModalTrigger(props) {
  return <DialogPrimitive.Trigger {...props} />;
}

// Close
function ModalClose(props) {
  return <DialogPrimitive.Close {...props} />;
}

export {
  CustomModal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalClose,
};
