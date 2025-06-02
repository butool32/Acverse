"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  required?: boolean;
}

export function InputField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  className,
  required = false,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <Label htmlFor={id} className="text-sm font-medium text-foreground/80">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>

      <div className="relative">
        <Input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            "h-12 rounded-xl bg-background/50 backdrop-blur-sm border-muted/50",
            "transition-all duration-200 ease-in-out",
            "focus:ring-2 focus:ring-primary/20 border-gray-300 focus:border-primary",
            "hover:border-primary/50",
            error
              ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
              : ""
          )}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
