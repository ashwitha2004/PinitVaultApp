import { useEffect, useState } from "react";
import {
  Upload,
  Plus,
  Share2,
  QrCode,
} from "lucide-react";
import Header from "../components/Header";
import UploadSheet from "../components/UploadSheet";
import type { UploadedFile } from "../types";

interface Props {
  uploadedFiles?: UploadedFile[];
  onFileUpload: (file: File, fileType: string) => void;
  isUploading: boolean;
}

const Dashboard: React.FC<Props> = ({ uploadedFiles, onFileUpload, isUploading }) => {
  const [isUploadSheetOpen, setIsUploadSheetOpen] = useState(false);
  const [storedFiles, setStoredFiles] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  const normalizeDataUrl = (value: unknown, mimeType?: string): string => {
    if (typeof value !== "string" || !value.trim()) return "";
    if (value.startsWith("data:")) return value;
    const cleanBase64 = value.replace(/\s/g, "");
    if (!cleanBase64) return "";
    const finalMime = mimeType && mimeType.includes("/") ? mimeType : "application/octet-stream";
    return `data:${finalMime};base64,${cleanBase64}`;
  };

  const normalizeVaultFile = (entry: any) => {
    if (!entry || typeof entry !== "object") return null;
    const type = typeof entry.type === "string" ? entry.type : "";
    const data = normalizeDataUrl(entry.data, type);
    if (!data) return null;

    return {
      id: String(entry.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
      name: typeof entry.name === "string" ? entry.name : "Untitled",
      type,
      size: Number(entry.size ?? 0),
      data,
      uploadedAt: typeof entry.uploadedAt === "string"
        ? entry.uploadedAt
        : (typeof entry.createdAt === "string" ? entry.createdAt : new Date().toISOString()),
    };
  };

  const readVaultFiles = () => {
    try {
      const raw = localStorage.getItem("vaultFiles");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(normalizeVaultFile).filter(Boolean);
    } catch {
      return [];
    }
  };

  const syncStoredFiles = () => {
    setStoredFiles(readVaultFiles());
  };

  useEffect(() => {
    syncStoredFiles();

    // Load profile data
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    const handleStorageChange = () => {
      syncStoredFiles();
      // Reload profile data when storage changes
      const updatedProfile = localStorage.getItem('user_profile');
      if (updatedProfile) {
        setProfile(JSON.parse(updatedProfile));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const saveFileToVault = (file: File, base64Data: string) => {
    const existing = readVaultFiles();
    const newFile = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      data: base64Data,
      uploadedAt: new Date().toISOString(),
    };

    const updated = [newFile, ...existing];
    localStorage.setItem("vaultFiles", JSON.stringify(updated));
    syncStoredFiles();
    window.dispatchEvent(new Event("storage"));
  };
  
  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller file.');
        event.target.value = '';
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64 = reader.result;
        if (typeof base64 !== "string") {
          alert("Error reading file. Please try again.");
          event.target.value = "";
          return;
        }

        saveFileToVault(file, base64);
        
        event.target.value = '';
        setIsUploadSheetOpen(false);
        alert("Uploaded successfully!");
      };
      
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
        event.target.value = '';
      };
      
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Please select a valid PDF file');
      event.target.value = '';
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller file.');
        event.target.value = '';
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64 = reader.result;
        if (typeof base64 !== "string") {
          alert("Error reading file. Please try again.");
          event.target.value = "";
          return;
        }

        saveFileToVault(file, base64);
        
        event.target.value = '';
        setIsUploadSheetOpen(false);
        alert("Uploaded successfully!");
      };
      
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
        event.target.value = '';
      };
      
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Please select a valid image file');
      event.target.value = '';
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller file.');
        event.target.value = '';
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64 = reader.result;
        if (typeof base64 !== "string") {
          alert("Error reading file. Please try again.");
          event.target.value = "";
          return;
        }

        saveFileToVault(file, base64);
        
        event.target.value = '';
        setIsUploadSheetOpen(false);
        alert("Uploaded successfully!");
      };
      
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
        event.target.value = '';
      };
      
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Please select a valid video file');
      event.target.value = '';
    }
  };

  const handleScanDocument = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller file.');
        event.target.value = '';
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64 = reader.result;
        if (typeof base64 !== "string") {
          alert("Error reading file. Please try again.");
          event.target.value = "";
          return;
        }

        saveFileToVault(file, base64);
        
        event.target.value = '';
        setIsUploadSheetOpen(false);
        alert("Uploaded successfully!");
      };
      
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
        event.target.value = '';
      };
      
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid file');
      event.target.value = '';
    }
  };

  const handleCapturePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller file.');
        event.target.value = '';
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64 = reader.result;
        if (typeof base64 !== "string") {
          alert("Error reading file. Please try again.");
          event.target.value = "";
          return;
        }

        saveFileToVault(file, base64);
        
        event.target.value = '';
        setIsUploadSheetOpen(false);
        alert("Uploaded successfully!");
      };
      
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
        event.target.value = '';
      };
      
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Please select a valid image file');
      event.target.value = '';
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-900 via-blue-800 to-black pb-20">
      <div className="max-w-md mx-auto">
        <Header name={profile?.name || "User"} showWelcome={true} avatar={profile?.avatar} />

        {/* Stats Cards */}
        <div className="px-4 -mt-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20">
              <p className="text-white/70 text-sm">Docs Stored</p>
              <p className="text-white text-2xl font-bold mt-1">{storedFiles.length}</p>
              <p className="text-green-400 text-xs mt-1">
                {storedFiles.length > 0 ? `+${storedFiles.length} files uploaded` : 'No files uploaded'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20">
              <p className="text-white/70 text-sm">Active Shares</p>
              <p className="text-white text-2xl font-bold mt-1">8</p>
              <p className="text-yellow-400 text-xs mt-1">3 expire soon</p>
            </div>
          </div>
        </div>

        {/* Portfolio View Card */}
        <div className="px-4 mt-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/20">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-white/70 text-sm">Portfolio Views</p>
                <p className="text-white text-3xl font-bold mt-1">1,204</p>
              </div>
              <div className="w-16 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg opacity-60"></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 mt-6">
          <p className="text-white/70 text-sm font-medium mb-4">Quick Actions</p>
          <div className="grid grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <span className="text-white/80 text-xs">Upload</span>
            </button>
            <button 
              className="flex flex-col items-center gap-2"
              onClick={() => {
                console.log("Create clicked");
                setIsUploadSheetOpen(true);
              }}
            >
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <span className="text-white/80 text-xs">Create</span>
            </button>
            <button className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-white/80 text-xs">Share</span>
            </button>
            <button className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <span className="text-white/80 text-xs">Scan QR</span>
            </button>
          </div>
        </div>

        {/* Storage Overview */}
        <div className="px-4 mt-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/20">
            <p className="text-white/70 text-sm font-medium mb-4">Storage Overview</p>
            
            {/* Circular Progress */}
            <div className="flex justify-center mb-4">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full border-8 border-white/10"></div>
                <div className="absolute inset-0 rounded-full border-8 border-t-blue-400 border-r-blue-400 border-b-transparent border-l-transparent transform rotate-45"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-white text-2xl font-bold">45%</p>
                    <p className="text-white/60 text-xs">Used</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Storage Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">IDs</span>
                <span className="text-white text-sm font-medium">20%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Certificates</span>
                <span className="text-white text-sm font-medium">15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Medical</span>
                <span className="text-white text-sm font-medium">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Uploaded Files Display */}
        {storedFiles.length > 0 && (
            <div className="px-4 mt-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/20">
                <p className="text-white/70 text-sm font-medium mb-3">Recently Uploaded Files</p>
                <div className="space-y-2">
                  {storedFiles.slice(0, 3).map((file: any) => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          file.type.includes('pdf') ? 'bg-red-500' : 
                          file.type.includes('image') ? 'bg-green-500' : 
                          'bg-blue-500'
                        }`}>
                          <span className="text-white text-xs font-bold">
                            {file.type.includes('pdf') ? 'PDF' : 
                             file.type.includes('image') ? 'IMG' : 
                             'VID'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                          <p className="text-white/50 text-xs">{file.uploadedAt}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

      {/* Floating Upload Button */}
      <button
        onClick={() => setIsUploadSheetOpen(true)}
        disabled={isUploading}
        className={`fixed bottom-24 right-5 text-white p-4 rounded-full shadow-lg transition-shadow ${
          isUploading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-xl'
        }`}
      >
        {isUploading ? (
          <div className="w-6 h-6 border-2 border-white/30 border-t-transparent animate-spin rounded-full"></div>
        ) : (
          <Plus className="w-6 h-6" />
        )}
      </button>

      {/* Upload Sheet */}
      <UploadSheet
        isOpen={isUploadSheetOpen}
        onClose={() => setIsUploadSheetOpen(false)}
        onPdfUpload={handlePdfUpload}
        onImageUpload={handleImageUpload}
        onVideoUpload={handleVideoUpload}
        onScanDocument={handleScanDocument}
        onCapturePhoto={handleCapturePhoto}
      />
    </div>
  );
};

export default Dashboard;
