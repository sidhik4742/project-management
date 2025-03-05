import * as React from "react";

import { cn } from "@/lib/utils";

export interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="file"
        className={cn(
          "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

FileInput.displayName = "FileInput";

export { FileInput };
