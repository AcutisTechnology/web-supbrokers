"use client";

import React, { useState, useEffect } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps extends Omit<NumericFormatProps, "value" | "onChange"> {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function CurrencyInput({
  value,
  onChange,
  className,
  ...props
}: CurrencyInputProps) {
  // Usar um estado local para evitar problemas de hidratação
  const [mounted, setMounted] = useState(false);
  
  // Atualizar o estado mounted após a montagem do componente
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Renderizar um placeholder durante a hidratação
  if (!mounted) {
    return (
      <Input
        className={cn("bg-white", className)}
        // Filtrar propriedades que podem causar problemas de tipo
        {...(Object.fromEntries(
          Object.entries(props).filter(([key]) => 
            !["defaultValue", "value", "onChange"].includes(key)
          )
        ))}
      />
    );
  }
  
  return (
    <NumericFormat
      customInput={Input}
      thousandSeparator="."
      decimalSeparator=","
      prefix="R$ "
      decimalScale={2}
      fixedDecimalScale
      value={value === 0 ? "" : value} // Usar string vazia em vez de 0 para evitar mostrar R$ 0,00
      onValueChange={(values) => {
        onChange(values.floatValue || 0);
      }}
      className={cn("bg-white", className)}
      allowNegative={false}
      placeholder="R$ 0,00"
      {...props}
    />
  );
} 