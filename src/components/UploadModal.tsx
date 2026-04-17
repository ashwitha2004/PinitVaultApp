import { useState } from "react";
import { X, Upload, Image, Camera } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (file: File, fileType: string) => void;
};

const UploadModal = ({ isOpen, onClose, onFileUpload }: Props) => {
  const [files, setFiles] = useState<File[]>([]);

  if (!isOpen) return null;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("Uploaded file:", file);
    
    // Validate file type
    if (fileType === 'pdf' && file.type !== 'application/pdf') {
      alert('Please select a valid PDF file');
      return;
    }
    
    if (fileType === 'image' && !file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Store file in state
    setFiles(prev => [...prev, file]);
    
    // Call parent handler
    onFileUpload(file, fileType);
    
    // Close modal
    onClose();
  };

  const triggerFileInput = (fileType: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    
    if (fileType === 'pdf') {
      input.accept = '.pdf,application/pdf';
    } else if (fileType === 'image') {
      input.accept = 'image/*';
    } else {
      input.accept = 'image/*,.pdf';
    }
    
    input.onchange = (e) => handleFileUpload(e as any, fileType);
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
        <div className="bg-white w-full max-w-md rounded-t-2xl p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Upload</h2>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <button
              onClick={() => triggerFileInput('pdf')}
              className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Upload className="text-blue-500" />
              <div className="text-left">
                <p className="font-medium">Upload PDF</p>
                <p className="text-sm text-gray-500">Import documents</p>
              </div>
            </button>

            <button
              onClick={() => triggerFileInput('image')}
              className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Image className="text-purple-500" />
              <div className="text-left">
                <p className="font-medium">Upload Image</p>
                <p className="text-sm text-gray-500">From gallery</p>
              </div>
            </button>

            <button
              onClick={() => triggerFileInput('image')}
              className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Camera className="text-green-500" />
              <div className="text-left">
                <p className="font-medium">Capture Photo</p>
                <p className="text-sm text-gray-500">Use camera</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadModal;
