"use client";

import React, { useState, useEffect } from "react";
import { NumericFormat as _NumericFormat, NumericFormatProps } from "react-number-format";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NumericFormat = _NumericFormat as any;
import { Input } from "./input";
import { cn } from "@/lib/utils";


interface CurrencyInputProps extends Omit<NumericFormatProps, "value" | "onChange"> {
  value: number;
  onChange: (value: number, values: { floatValue?: number }) => void;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function CurrencyInput({
  value,
  onChange,
  className,
  prefix = "R$ ",
  suffix,
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
      prefix={prefix}
      suffix={suffix}
      decimalScale={2}
      fixedDecimalScale
      value={value === 0 ? "" : value} // Usar string vazia em vez de 0 para evitar mostrar R$ 0,00
      onValueChange={(values: { floatValue?: number }) => {
        onChange(values.floatValue || 0, values);
      }}
      className={cn("bg-white", className)}
      allowNegative={false}
      placeholder={prefix === "R$ " ? "R$ 0,00" : "0,00%"}
      {...props}
    />
  );
} 