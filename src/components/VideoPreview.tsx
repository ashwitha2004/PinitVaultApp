import React from "react";
import { X } from "lucide-react";

interface Props {
  file: {
    id: string;
    name: string;
    type: string;
    size: number;
    createdAt: string;
    data: string;
    mimeType: string;
    portfolio?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const VideoPreview: React.FC<Props> = ({ file, isOpen, onClose }) => {
  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-4xl max-h-4xl m-4">
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-lg font-semibold">Video Preview</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          
          <div className="flex justify-center">
            <video
              src={file.data}
              controls
              className="max-w-full max-h-96 rounded-lg"
              preload="metadata"
            >
              Your browser does not support video playback.
            </video>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-white font-medium">{file.name}</p>
            <p className="text-gray-400 text-sm mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
