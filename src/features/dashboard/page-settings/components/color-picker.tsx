'use client';

import { useState } from 'react';
import { HexColorPicker as _HexColorPicker } from 'react-colorful';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HexColorPicker = _HexColorPicker as any;

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className="w-full h-10 rounded-md border border-input cursor-pointer"
        style={{ backgroundColor: value }}
        onClick={() => setIsOpen(!isOpen)}
      />
      
      {isOpen && (
        <div className="absolute z-50 mt-2 p-2 bg-white rounded-lg shadow-lg">
          <HexColorPicker color={value} onChange={onChange} />
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-2 py-1 text-sm border rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
} 