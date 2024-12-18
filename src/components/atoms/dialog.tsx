"use client";

import React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  children,
}) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      {/* Dialog container with animation */}
      <div
        className={cn(
          "relative bg-[#1C1C1E] border border-gray-800",
          "rounded-xl shadow-2xl max-w-md w-full mx-4",
          "transform transition-all duration-200",
          "animate-in fade-in-0 zoom-in-95",
          "dark:bg-[#1C1C1E]"
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export const DialogContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn("p-6 text-gray-100", "relative", className)}>
      {children}
    </div>
  );
};

export const DialogHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={cn("mb-6 space-y-2", className)}>{children}</div>;
};

export const DialogTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <h2
      className={cn(
        "text-xl font-semibold text-white",
        "leading-none tracking-tight",
        className
      )}
    >
      {children}
    </h2>
  );
};

export const DialogDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <p className={cn("text-sm text-gray-400", className)}>{children}</p>;
};

export const DialogFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "mt-6 flex justify-end space-x-2",
        "border-t border-gray-800 pt-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export const DialogClose: React.FC<{
  onClick: () => void;
  className?: string;
}> = ({ onClick, className }) => {
  return (
    <button
      className={cn(
        "absolute top-4 right-4",
        "rounded-full p-1.5",
        "text-gray-400 hover:text-white",
        "bg-[#2C2C2E] hover:bg-[#3C3C3E]",
        "transition-colors",
        className
      )}
      onClick={onClick}
    >
      <X className="h-4 w-4" />
    </button>
  );
};
interface DialogTriggerProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  asChild?: boolean;
}

export const DialogTrigger: React.FC<DialogTriggerProps> = ({
  children,
  onClick,
  className,
  asChild,
}) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
        (children as any).props?.onClick?.(e);
      },
      className: cn(children.props.className, className),
    });
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      className={cn("cursor-pointer", className)}
    >
      {children}
    </button>
  );
};
