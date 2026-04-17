import React from "react";
import { X, Upload, FileText, Image, Camera, Video } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPdfUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onScanDocument: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCapturePhoto: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadSheet: React.FC<Props> = ({ isOpen, onClose, onPdfUpload, onImageUpload, onVideoUpload, onScanDocument, onCapturePhoto }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-white rounded-t-2xl p-5 shadow-xl animate-slideUp">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Upload</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <button 
            onClick={() => document.getElementById('scan-upload')?.click()}
            className="flex items-center gap-3 p-3 w-full rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            <Upload className="w-5 h-5 text-blue-600" />
            <span>Scan Document</span>
          </button>

          <button 
            onClick={() => document.getElementById('pdf-upload')?.click()}
            className="flex items-center gap-3 p-3 w-full rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            <FileText className="w-5 h-5 text-purple-600" />
            <span>Upload PDF</span>
          </button>

          <button 
            onClick={() => document.getElementById('image-upload')?.click()}
            className="flex items-center gap-3 p-3 w-full rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            <Image className="w-5 h-5 text-green-600" />
            <span>Upload Image</span>
          </button>

          <button 
            onClick={() => document.getElementById('photo-upload')?.click()}
            className="flex items-center gap-3 p-3 w-full rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            <Camera className="w-5 h-5 text-orange-600" />
            <span>Capture Photo</span>
          </button>

          <button 
            onClick={() => document.getElementById('video-upload')?.click()}
            className="flex items-center gap-3 p-3 w-full rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            <Video className="w-5 h-5 text-red-600" />
            <span>Upload Video</span>
          </button>
        </div>

        {/* Hidden File Inputs */}
        <input
          id="pdf-upload"
          type="file"
          accept=".pdf,application/pdf"
          onChange={onPdfUpload}
          className="hidden"
        />
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
        />
        <input
          id="video-upload"
          type="file"
          accept="video/mp4,video/webm"
          onChange={onVideoUpload}
          className="hidden"
        />
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onCapturePhoto}
          className="hidden"
        />
        <input
          id="scan-upload"
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={onScanDocument}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default UploadSheet;