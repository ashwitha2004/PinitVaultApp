import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, MoreHorizontal, Eye, Share2, Edit, Trash2, Image, Video, Search } from 'lucide-react';
import Header from "../components/Header";
import PageContainer from "../components/layout/PageContainer";

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

const Vault = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const normalizeDataUrl = (value: unknown, mimeType?: string): string => {
    if (typeof value !== "string" || !value.trim()) return "";

    if (value.startsWith("data:")) {
      return value;
    }

    const cleanBase64 = value.replace(/\s/g, "");
    if (!cleanBase64) return "";

    const finalMime = mimeType && mimeType.includes("/") ? mimeType : "application/octet-stream";
    return `data:${finalMime};base64,${cleanBase64}`;
  };

  const normalizeVaultFile = (entry: any): VaultFile | null => {
    if (!entry || typeof entry !== "object") return null;

    const name = typeof entry.name === "string" ? entry.name : "Untitled";
    const type = typeof entry.type === "string" ? entry.type : "";
    
    // Handle protected files - don't try to read data if it's null
    let data = "";
    if (entry.data !== null && entry.data !== undefined) {
      data = normalizeDataUrl(entry.data, type);
    } else if (entry.fileObject) {
      // For protected files, we'll generate data on demand during preview
      data = "";
    }

    return {
      id: String(entry.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
      name,
      type,
      size: Number(entry.size ?? 0),
      data: data || null,
      uploadedAt: typeof entry.uploadedAt === "string"
        ? entry.uploadedAt
        : (typeof entry.createdAt === "string" ? entry.createdAt : new Date().toISOString()),
      isProtected: entry.isProtected || false,
      fileObject: entry.fileObject || null,
    };
  };

  const readVaultFiles = (): VaultFile[] => {
    try {
      const raw = localStorage.getItem("vaultFiles");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(normalizeVaultFile).filter(Boolean) as VaultFile[];
    } catch {
      return [];
    }
  };

  const writeVaultFiles = (updatedFiles: VaultFile[]) => {
    localStorage.setItem("vaultFiles", JSON.stringify(updatedFiles));
    setFiles(updatedFiles);
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    const loadFiles = () => {
      const storedFiles = readVaultFiles();
      setFiles(storedFiles);
    };

    loadFiles();

    const handleStorageChange = () => {
      loadFiles();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Filter files based on search
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // MENU FUNCTIONS

  const handleDelete = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    writeVaultFiles(updated);
    setOpenMenuId(null);
  };

  const handleRename = (id: string) => {
    const newName = prompt("Enter new name:");
    if (!newName) return;

    const updated = files.map((f) =>
      f.id === id ? { ...f, name: newName.trim() || f.name } : f
    );

    writeVaultFiles(updated);
    setOpenMenuId(null);
  };

  const handleView = (id: string) => {
    navigate(`/vault/view/${id}`);
    setOpenMenuId(null);
  };

  const handleShare = (file: VaultFile) => {
    if (file.data) {
      navigator.clipboard.writeText(file.data);
      alert("File link copied");
    } else {
      alert("No file data available to copy");
    }
    setOpenMenuId(null);
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileText;
    if (type.includes('image')) return Image;
    if (type.includes('video')) return Video;
    return FileText;
  };

  const getFileColor = (type: string) => {
    if (type.includes('pdf')) return 'bg-red-500';
    if (type.includes('image')) return 'bg-green-500';
    if (type.includes('video')) return 'bg-purple-500';
    return 'bg-blue-500';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <PageContainer>
      <Header showWelcome={false} />

      <div>
        {/* Header */}
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Vault</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your vault"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* File Cards */}
        {filteredFiles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No files yet</h2>
            <p className="text-gray-600">Your vault is empty. Files will appear here when uploaded.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFiles.map((file) => {
              const Icon = getFileIcon(file.type);
              const iconColor = getFileColor(file.type);
              
              return (
                <div key={file.id} className="relative p-3 bg-white rounded-xl mb-2 shadow">
                  <div className="flex justify-between items-center min-w-0">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                        {file.type.includes("image") && file.data ? (
                          <img src={file.data} alt={file.name} className="w-full h-full object-cover" />
                        ) : file.type.includes("pdf") && file.data && !file.isProtected ? (
                          <iframe src={file.data} title={file.name} className="w-full h-full border-0 pointer-events-none" />
                        ) : (
                          <Icon className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {file.uploadedAt} | {formatFileSize(file.size || 0)}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setOpenMenuId(openMenuId === file.id ? null : file.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* MENU */}
                  {openMenuId === file.id && (
                    <div className="absolute right-2 top-10 bg-white shadow-lg rounded-lg p-2 z-50 min-w-[120px]">
                      <button
                        onClick={() => handleView(file.id)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleRename(file.id)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Rename
                      </button>
                      <button
                        onClick={() => handleShare(file)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Vault;
