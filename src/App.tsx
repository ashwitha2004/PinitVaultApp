import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { MobileShell } from "./components/MobileShell";
import Dashboard from "./pages/Dashboard";
import Vault from "./pages/Vault";
import PortfolioHome from "./pages/portfolio/PortfolioHome";
import SelectPortfolioType from "./pages/portfolio/SelectPortfolioType";
import TemplateBuilder from "./pages/portfolio/TemplateBuilder";
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
import PortfolioShare from "./pages/PortfolioShare";
import PublicPortfolio from "./pages/PublicPortfolio";
import Activity from "./pages/Activity";
import Profile from "./pages/Profile";
import SelectFromVault from "./pages/SelectFromVault";
import ReviewPortfolio from './pages/portfolio/ReviewPortfolio';
import EditPortfolioPage from './pages/portfolio/EditPortfolioPage';
import VaultFileViewer from './pages/VaultFileViewer';

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
    
    try {
      console.log('File upload:', file.name, file.type); // Debug log
      
      // Store file without reading content
      const newFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        type: fileType as "pdf" | "image" | "video",
        size: file.size,
        createdAt: new Date().toISOString(),
        data: null, // Store as null initially
        fileObject: file, // Store the File object reference
        mimeType: file.type,
        isProtected: false, // Will be determined when preview is attempted
      };
      setUploadedFiles(prev => [...prev, newFile]);
      setIsUploading(false);
      
      // Dispatch custom event to notify Vault component
      window.dispatchEvent(new CustomEvent('vaultFilesUpdated'));
      
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      alert('Error uploading file. Please try again.');
    }
  };
  return (
    <BrowserRouter>
      <div className="mobile-root">
        <div className="app-container">
          <div className="page">
            <Routes>
              <Route path="/" element={<Dashboard uploadedFiles={uploadedFiles} onFileUpload={handleFileUpload} isUploading={isUploading} />} />
              <Route path="/vault" element={<Vault />} />
              <Route path="/vault/view/:id" element={<VaultFileViewer />} />
              <Route path="/portfolio" element={<PortfolioHome />} />
              <Route path="/portfolio/create" element={<SelectPortfolioType />} />
              <Route path="/portfolio/create/template" element={<TemplateBuilder />} />
              <Route path="/portfolio/choose-template" element={<ChoosePortfolioTemplatePage />} />
              <Route path="/portfolio/templates" element={<ChoosePortfolioTemplatePage />} />
              <Route path="/portfolio/preview" element={<PortfolioFlowPreviewPage />} />
              <Route path="/portfolio/view/:id" element={<PortfolioViewPage />} />
              <Route path="/portfolio/edit/:id" element={<EditPortfolioPage />} />
              <Route path="/portfolio/review" element={<ReviewPortfolio />} />
              <Route path="/portfolio/share/:id" element={<PortfolioShare />} />
              <Route path="/choose-portfolio-type" element={<ChoosePortfolioType />} />
              <Route path="/choose-template" element={<ChooseTemplate />} />
              <Route path="/add-documents-from-vault" element={<AddDocumentsFromVault />} />
              <Route path="/portfolio-creation-draft" element={<PortfolioCreationDraft />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/portfolio-preview" element={<PortfolioPreview />} />
              <Route path="/p/:id" element={<PublicPortfolio />} />
              <Route path="/select-from-vault" element={<SelectFromVault />} />
            </Routes>
          </div>
          <BottomNav />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
