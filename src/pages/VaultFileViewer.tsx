import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Image, Video, Maximize2 } from 'lucide-react';
import Header from '../components/Header';

interface VaultFile {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string | null;
  uploadedAt: string;
  isProtected?: boolean;
  fileObject?: File | null;
}

const VaultFileViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [file, setFile] = useState<VaultFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFile = () => {
      try {
        console.log("=== VAULT FILE VIEWER DEBUG ===");
        console.log("File ID from URL:", id);
        
        if (!id) {
          setError("No file ID provided");
          setLoading(false);
          return;
        }

        // Load files from localStorage
        const storedFiles = localStorage.getItem('vaultFiles');
        console.log("Raw vault files data:", storedFiles);
        
        if (!storedFiles) {
          setError("No files found in vault");
          setLoading(false);
          return;
        }

        const files = JSON.parse(storedFiles);
        console.log("Parsed files:", files);
        
        // Find the specific file
        const foundFile = files.find((f: any) => String(f.id) === String(id));
        console.log("Found file:", foundFile);
        
        if (!foundFile) {
          setError("File not found");
          setLoading(false);
          return;
        }

        // Normalize the file data
        const normalizedFile: VaultFile = {
          id: String(foundFile.id),
          name: foundFile.name || 'Untitled',
          type: foundFile.type || 'application/octet-stream',
          size: Number(foundFile.size) || 0,
          data: foundFile.data || '',
          uploadedAt: foundFile.uploadedAt || foundFile.createdAt || new Date().toISOString()
        };

        setFile(normalizedFile);
        setLoading(false);
        console.log("File loaded successfully:", normalizedFile);
        
      } catch (err) {
        console.error("Error loading file:", err);
        setError("Failed to load file");
        setLoading(false);
      }
    };

    loadFile();
  }, [id]);

  const handleDownload = () => {
    if (!file) return;
    
    try {
      if (!file.data) {
        alert("No file data available for download");
        return;
      }
      const link = document.createElement('a');
      link.href = file.data;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download file");
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileText;
    if (type.includes('image')) return Image;
    if (type.includes('video')) return Video;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const renderFileContent = () => {
    if (!file) return null;

    // PDF files
    if (file.type.includes('pdf')) {
      if (file.data && !file.isProtected) {
        return (
          <div className="w-full h-full">
            <iframe
              src={file.data}
              title={file.name}
              className="w-full h-full border-0"
              style={{ minHeight: '600px' }}
            />
          </div>
        );
      } else {
        // Protected PDF - show fallback
        return (
          <div className="flex flex-col items-center justify-center w-full h-full text-center p-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Preview not available</h3>
            <p className="text-gray-600 mb-6">
              This PDF is password-protected. Preview is not available, but you can download and view it with the correct password.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">File type: {file.type}</p>
              <p className="text-sm text-gray-500">Size: {formatFileSize(file.size)}</p>
              <p className="text-sm text-orange-600">🔒 Password protected</p>
            </div>
          </div>
        );
      }
    }

    // Image files
    if (file.type.includes('image')) {
      if (file.data) {
        return (
          <div className="flex items-center justify-center w-full h-full">
            <img
              src={file.data}
              alt={file.name}
              className="max-w-full max-h-full object-contain"
              style={{ maxHeight: '80vh' }}
            />
          </div>
        );
      } else {
        // Protected image - show fallback
        return (
          <div className="flex flex-col items-center justify-center w-full h-full text-center p-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <Image className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Preview not available</h3>
            <p className="text-gray-600 mb-6">
              This image could not be previewed. Please download to view.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">File type: {file.type}</p>
              <p className="text-sm text-gray-500">Size: {formatFileSize(file.size)}</p>
            </div>
          </div>
        );
      }
    }

    // Video files
    if (file.type.includes('video')) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <video
            src={file.data || undefined}
            controls
            className="max-w-full max-h-full"
            style={{ maxHeight: '80vh' }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // Unsupported files - fallback
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center p-8">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
          <FileText className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Cannot preview this file</h3>
        <p className="text-gray-600 mb-6">
          This file type is not supported for preview. You can download it to view.
        </p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">File type: {file.type}</p>
          <p className="text-sm text-gray-500">Size: {formatFileSize(file.size)}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-200"></div>
          <p className="mt-4 text-gray-600">Loading file...</p>
        </div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">File not found</h2>
          <p className="text-gray-600 mb-4">{error || 'The file you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/vault')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Vault
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Header showWelcome={false} />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/vault')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Vault
            </button>
            
            <div className="flex-1 mx-4 text-center">
              <h1 className="text-lg font-semibold text-gray-900 truncate">{file.name}</h1>
              <p className="text-sm text-gray-500">
                {formatFileSize(file.size)} • {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : 'Unknown date'}
              </p>
            </div>
            
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* File Content */}
      <div className="page-content">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ minHeight: '600px' }}>
          {renderFileContent()}
        </div>
      </div>
    </div>
  );
};

export default VaultFileViewer;
