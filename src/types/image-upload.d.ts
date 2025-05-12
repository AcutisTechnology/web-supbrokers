import { FC } from 'react';

export interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export declare const ImageUpload: FC<ImageUploadProps>; 