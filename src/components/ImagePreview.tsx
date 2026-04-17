import React from "react";
import { X } from "lucide-react";

interface Props {
  file: {
    id: string;
    name: string;
    type: string;
    size: number;
    data: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const ImagePreview: React.FC<Props> = ({ file, isOpen, onClose }) => {
  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-4xl max-h-4xl m-4">
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-lg font-semibold">Image Preview</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          
          <div className="flex justify-center">
            {file.data && (
              <img
                src={file.data}
                alt={file.name}
                className="max-w-full max-h-96 rounded-lg object-contain"
              />
            )}
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-white font-medium">{file.name}</p>
            <p className="text-gray-400 text-sm mt-1">
              {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB • ${file.type}` : 'File not available'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
