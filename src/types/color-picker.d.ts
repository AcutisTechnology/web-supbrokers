import { FC } from 'react';

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export declare const ColorPicker: FC<ColorPickerProps>; 