import * as React from "react";
import { cn } from "@/lib/utils";

interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  mask: string;
  value: string;
  onChange: (value: string) => void;
}

export function MaskedInput({
  className,
  mask,
  value,
  onChange,
  ...props
}: MaskedInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, "");
    let maskedValue = "";
    let inputIndex = 0;

    for (let i = 0; i < mask.length && inputIndex < inputValue.length; i++) {
      if (mask[i] === "#") {
        maskedValue += inputValue[inputIndex];
        inputIndex++;
      } else {
        maskedValue += mask[i];
      }
    }

    onChange(maskedValue);
  };

  return (
    <input
      type="text"
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
} 