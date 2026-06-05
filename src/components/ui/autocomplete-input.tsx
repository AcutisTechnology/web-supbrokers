"use client"

import * as React from "react"
import { Loader2, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export type AutocompleteOption = {
  id: string
  name: string
}

export type AutocompleteValue = {
  id: string | null
  name: string
}

type Props = {
  value: AutocompleteValue
  onChange: (value: AutocompleteValue) => void
  onSearch: (query: string) => Promise<AutocompleteOption[]>
  placeholder?: string
  disabled?: boolean
  className?: string
  inputClassName?: string
  debounceMs?: number
  createLabel?: (typed: string) => string
}

export function AutocompleteInput({
  value,
  onChange,
  onSearch,
  placeholder,
  disabled,
  className,
  inputClassName,
  debounceMs = 300,
  createLabel,
}: Props) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [options, setOptions] = React.useState<AutocompleteOption[]>([])
  const [query, setQuery] = React.useState(value.name)

  React.useEffect(() => {
    setQuery(value.name)
  }, [value.name])

  React.useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const el = containerRef.current
      if (!el) return
      if (event.target instanceof Node && !el.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [])

  React.useEffect(() => {
    if (!open) return

    const typed = query.trim()
    let cancelled = false

    const handle = window.setTimeout(async () => {
      setLoading(true)
      try {
        const result = await onSearch(typed)
        if (!cancelled) setOptions(Array.isArray(result) ? result : [])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, debounceMs)

    return () => {
      cancelled = true
      window.clearTimeout(handle)
    }
  }, [debounceMs, onSearch, open, query])

  const typed = query.trim()
  const hasCreateOption = typed.length > 0 && !!createLabel
  const showDropdown = open && (loading || options.length > 0 || hasCreateOption)

  const selectCreate = () => {
    onChange({ id: null, name: typed })
    setOpen(false)
  }

  const selectOption = (opt: AutocompleteOption) => {
    onChange({ id: opt.id, name: opt.name })
    setOpen(false)
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => {
            const next = e.target.value
            setQuery(next)
            onChange({ id: null, name: next })
            if (!open) setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn("pr-10", inputClassName)}
        />
        <div className="absolute inset-y-0 right-3 flex items-center">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : null}
        </div>
      </div>

      {showDropdown ? (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          <div className="max-h-72 overflow-auto">
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between"
                onClick={() => selectOption(opt)}
              >
                <span className="text-[#141414]">{opt.name}</span>
                {value.id === opt.id ? (
                  <span className="text-xs text-purple-600">Selecionado</span>
                ) : null}
              </button>
            ))}

            {hasCreateOption ? (
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 border-t border-gray-100"
                onClick={selectCreate}
              >
                <Plus className="h-4 w-4 text-purple-600" />
                <span className="text-purple-700">{createLabel(typed)}</span>
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

