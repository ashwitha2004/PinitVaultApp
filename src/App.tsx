import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Vault from "./pages/Vault";
import PortfolioPage from "./pages/PortfolioPage";
import CreatePortfolioPage from "./pages/CreatePortfolioPage";
import SelectDocumentsPage from "./pages/SelectDocumentsPage";
import ChoosePortfolioTemplatePage from "./pages/ChoosePortfolioTemplatePage";
import PortfolioFlowPreviewPage from "./pages/PortfolioFlowPreviewPage";
import PortfolioViewPage from "./pages/PortfolioViewPage";
import ChoosePortfolioType from "./pages/ChoosePortfolioType";
import ChooseTemplate from "./pages/ChooseTemplate";
import AddDocumentsFromVault from "./pages/AddDocumentsFromVault";
import PortfolioCreationDraft from "./pages/PortfolioCreationDraft";
import PortfolioPreview from "./pages/PortfolioPreview";
import Activity from "./pages/Activity";
import Profile from "./pages/Profile";

import BottomNav from "./components/BottomNav";
import type { UploadedFile } from "./types";

function App() {
  const [isUploading, setIsUploading] = useState(false);
  const readVaultFiles = (): UploadedFile[] => {
    try {
      const saved = localStorage.getItem("vaultFiles") || "[]";
      const files = JSON.parse(saved);
      if (Array.isArray(files)) return files;
      return [];
    } catch (error) {
      console.error("Error loading files from localStorage:", error);
      return [];
    }
  };

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(() => readVaultFiles());

  // Helper function to determine document category
  const getDocumentCategory = (file: UploadedFile): 'resume' | 'academic' | 'project' | 'certification' => {
    const name = file.name.toLowerCase();
    if (name.includes('resume') || name.includes('cv')) return 'resume';
    if (name.includes('degree') || name.includes('transcript') || name.includes('academic')) return 'academic';
    if (name.includes('certificate') || name.includes('certification') || name.includes('award')) return 'certification';
    if (name.includes('project') || name.includes('portfolio') || name.includes('work')) return 'project';
    return 'project'; // default
  };

  useEffect(() => {
    const vaultDocs = uploadedFiles.map((file: UploadedFile) => ({
      id: file.id,
      name: file.name,
      type: file.type,
      category: getDocumentCategory(file)
    }));
    localStorage.setItem("vaultDocuments", JSON.stringify(vaultDocs));
  }, [uploadedFiles]);

  useEffect(() => {
    const syncFromVault = () => {
      setUploadedFiles(readVaultFiles());
    };

    syncFromVault();
    window.addEventListener("storage", syncFromVault);
    window.addEventListener("vaultFilesUpdated", syncFromVault as EventListener);

    return () => {
      window.removeEventListener("storage", syncFromVault);
      window.removeEventListener("vaultFilesUpdated", syncFromVault as EventListener);
    };
  }, []);

  const handleFileUpload = (file: File, fileType: string) => {
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      console.log('FileReader result:', base64String); // Debug log
      
      // Verify base64 format
      if (!base64String || !base64String.startsWith('data:')) {
        console.error('Invalid base64 data generated');
        setIsUploading(false);
        return;
      }
      
      const newFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        type: fileType as "pdf" | "image" | "video",
        size: file.size,
        createdAt: new Date().toISOString(),
        data: base64String,
        mimeType: file.type,
      };
      setUploadedFiles(prev => [...prev, newFile]);
      setIsUploading(false);
      
      // Dispatch custom event to notify Vault component
      window.dispatchEvent(new CustomEvent('vaultFilesUpdated'));
      
      alert('File uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };
  return (
    <BrowserRouter>
      <div className="h-screen overflow-hidden flex items-center justify-center bg-black">
        <div className="relative max-w-sm w-full h-[90vh] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#0f172a] to-[#1e3a8a]">
          <div className="h-full overflow-y-auto px-4 pt-4 pb-24">
            <Routes>
              <Route path="/" element={<Dashboard uploadedFiles={uploadedFiles} onFileUpload={handleFileUpload} isUploading={isUploading} />} />
              <Route path="/vault" element={<Vault />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/portfolio/create" element={<CreatePortfolioPage />} />
              <Route path="/portfolio/select-documents" element={<SelectDocumentsPage />} />
              <Route path="/portfolio/choose-template" element={<ChoosePortfolioTemplatePage />} />
              <Route path="/portfolio/templates" element={<ChoosePortfolioTemplatePage />} />
              <Route path="/portfolio/preview" element={<PortfolioFlowPreviewPage />} />
              <Route path="/portfolio/view/:id" element={<PortfolioViewPage />} />
              <Route path="/choose-portfolio-type" element={<ChoosePortfolioType />} />
              <Route path="/choose-template" element={<ChooseTemplate />} />
              <Route path="/add-documents" element={<AddDocumentsFromVault />} />
              <Route path="/add-documents-from-vault" element={<AddDocumentsFromVault />} />
              <Route path="/portfolio-creation-draft" element={<PortfolioCreationDraft />} />
              <Route path="/portfolio-preview" element={<PortfolioPreview />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>

          <BottomNav />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
