import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, FileText, Image, Video, BookOpen, Briefcase, Award, Upload, Search, Eye, Shield, GraduationCap } from 'lucide-react';

interface VaultDocument {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'video';
  size: string;
  uploadDate: string;
  category: 'academic' | 'professional' | 'masters' | 'certifications' | 'personal';
  verified?: boolean;
  priority?: number; // For smart filtering based on portfolio type
}

const AddDocumentsFromVault: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [vaultDocuments, setVaultDocuments] = useState<VaultDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('All Files');
  const [selectedType, setSelectedType] = useState<'personal' | 'academic' | 'professional' | 'masters' | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const getRealVaultDocuments = (portfolioType: string): VaultDocument[] => {
    try {
      // Get vault files from localStorage
      const vaultFiles = JSON.parse(localStorage.getItem('vaultFiles') || '[]');
      const vaultDocuments = JSON.parse(localStorage.getItem('vaultDocuments') || '[]');
      
      // Combine data from both sources
      const combinedDocuments = vaultFiles.map((file: any, index: number) => {
        const vaultDoc = vaultDocuments[index] || {};
        
        // Convert file size to readable format
        const formatFileSize = (bytes: number) => {
          if (bytes === 0) return '0 KB';
          const k = 1024;
          const sizes = ['KB', 'MB', 'GB'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
        };

        // Determine category based on file name
        const getCategory = (name: string): 'academic' | 'professional' | 'masters' | 'certifications' | 'personal' => {
          const lowerName = name.toLowerCase();
          if (lowerName.includes('degree') || lowerName.includes('transcript') || lowerName.includes('academic') || lowerName.includes('marksheet')) return 'academic';
          if (lowerName.includes('resume') || lowerName.includes('cv') || lowerName.includes('project') || lowerName.includes('experience')) return 'professional';
          if (lowerName.includes('sop') || lowerName.includes('gre') || lowerName.includes('ielts') || lowerName.includes('toefl') || lowerName.includes('lor') || lowerName.includes('financial')) return 'masters';
          if (lowerName.includes('certificate') || lowerName.includes('certification') || lowerName.includes('award')) return 'certifications';
          if (lowerName.includes('passport') || lowerName.includes('aadhaar') || lowerName.includes('license') || lowerName.includes('pan')) return 'personal';
          return 'professional'; // default
        };

        // Set priority based on portfolio type and category
        const getPriority = (category: string, portfolioType: string) => {
          if (category === portfolioType) return 10;
          if (category === 'certifications' && portfolioType === 'professional') return 8;
          if (category === 'academic' && portfolioType === 'professional') return 6;
          if (category === 'academic' && portfolioType === 'masters') return 7;
          if (category === 'professional' && portfolioType === 'masters') return 5;
          return 3;
        };

        // Get upload date from createdAt or current date
        const uploadDate = file.createdAt ? new Date(file.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Nov 2024';

        return {
          id: file.id,
          name: file.name,
          type: file.type as 'pdf' | 'image' | 'video',
          size: formatFileSize(file.size || 0),
          uploadDate: uploadDate,
          category: getCategory(file.name),
          verified: Math.random() > 0.5, // Random verification status for demo
          priority: getPriority(getCategory(file.name), portfolioType)
        };
      });

      // Sort by priority (higher priority first for smart filtering)
      return combinedDocuments.sort((a: VaultDocument, b: VaultDocument) => (b.priority || 0) - (a.priority || 0));
    } catch (error) {
      console.error('Error loading vault documents:', error);
      return [];
    }
  };

  useEffect(() => {
    const state = location.state as { selectedType?: 'personal' | 'academic' | 'professional' | 'masters', selectedTemplate?: string };
    if (state?.selectedType) {
      setSelectedType(state.selectedType);
      setSelectedTemplate(state.selectedTemplate || null);
      // Load real vault documents from localStorage
      const realVaultDocuments = getRealVaultDocuments(state.selectedType);
      setVaultDocuments(realVaultDocuments);
    } else {
      // If no portfolio type, go back to type selection
      navigate('/select-type');
    }
  }, [location.state, navigate]);

  const getFilteredDocuments = () => {
    let filtered = vaultDocuments;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (activeFilter !== 'All Files') {
      filtered = filtered.filter(doc => {
        switch (activeFilter) {
          case 'PDFs':
            return doc.type === 'pdf';
          case 'Images':
            return doc.type === 'image';
          case 'Verified':
            return doc.verified === true;
          default:
            return doc.category === activeFilter.toLowerCase();
        }
      });
    }

    return filtered;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'professional':
        return Briefcase;
      case 'academic':
        return BookOpen;
      case 'masters':
        return GraduationCap;
      case 'certifications':
        return Award;
      default:
        return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'professional':
        return 'bg-blue-500';
      case 'academic':
        return 'bg-purple-500';
      case 'masters':
        return 'bg-green-500';
      case 'certifications':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return Image;
      case 'video':
        return Video;
      default:
        return FileText;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'bg-green-500';
      case 'video':
        return 'bg-purple-500';
      default:
        return 'bg-red-500';
    }
  };

  const getSelectedCountByCategory = (category: string) => {
    return selectedDocs.filter(docId => {
      const doc = vaultDocuments.find(d => d.id === docId);
      return doc?.category === category;
    }).length;
  };

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleContinue = () => {
    if (selectedDocs.length > 0 && selectedType && selectedTemplate) {
      // Create portfolio draft object
      const portfolioDraft = {
        id: Date.now().toString(),
        type: selectedType,
        template: selectedTemplate,
        documents: selectedDocs.map(docId => vaultDocuments.find(d => d.id === docId)).filter(Boolean),
        createdAt: new Date().toISOString(),
        status: 'draft'
      };
      
      navigate('/portfolio-preview', { 
        state: { portfolio: portfolioDraft } 
      });
    }
  };

  const handleBack = () => {
    navigate('/create-portfolio', { state: { selectedType } });
  };

  const handlePreviewDocument = (docId: string) => {
    const document = vaultDocuments.find(doc => doc.id === docId);
    if (document) {
      alert(`Document preview for "${document.name}" coming soon!`);
    }
  };

  const handleUploadNewFile = () => {
    alert('Upload new file functionality coming soon! This will add files to your Vault first.');
  };

  const filteredDocuments = getFilteredDocuments();
  const selectedCount = selectedDocs.length;

  // Group documents by category
  const groupedDocuments = {
    'Academic': filteredDocuments.filter(doc => doc.category === 'academic'),
    'Professional': filteredDocuments.filter(doc => doc.category === 'professional'),
    'Masters': filteredDocuments.filter(doc => doc.category === 'masters'),
    'Certifications': filteredDocuments.filter(doc => doc.category === 'certifications'),
    'Personal': filteredDocuments.filter(doc => doc.category === 'personal')
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Add Documents</h1>
            <div className="w-9"></div>
          </div>
          
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div className="w-8 h-0.5 bg-blue-500"></div>
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div className="w-8 h-0.5 bg-blue-500"></div>
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium">
                4
              </div>
            </div>
          </div>
          
          <p className="text-center text-sm text-gray-600">Step 3 of 4</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 pb-32">
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

        {/* Filter Chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['All Files', 'PDFs', 'Images', 'Verified'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Document Categories */}
        <div className="space-y-6 mb-8">
          {Object.entries(groupedDocuments).map(([category, documents]) => {
            
            const CategoryIcon = getCategoryIcon(category);
            const categoryColor = getCategoryColor(category);

            return (
              <div key={category}>
                {/* Category Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 ${categoryColor} rounded-lg flex items-center justify-center`}>
                      <CategoryIcon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {documents.length}
                    </span>
                  </div>
                  {getSelectedCountByCategory(category.toLowerCase()) > 0 && (
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {getSelectedCountByCategory(category.toLowerCase())} selected
                    </span>
                  )}
                </div>

                {/* Documents in Category */}
                <div className="space-y-2">
                  {documents.map((doc) => {
                    const FileIcon = getFileIcon(doc.type);
                    const fileColor = getFileColor(doc.type);
                    const isSelected = selectedDocs.includes(doc.id);
                    
                    return (
                      <button
                        key={doc.id}
                        onClick={() => toggleDocumentSelection(doc.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Selection Indicator */}
                          {isSelected && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {!isSelected && (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
                          )}

                          {/* File Icon */}
                          <div className={`w-10 h-10 ${fileColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <FileIcon className="w-5 h-5 text-white" />
                          </div>

                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {doc.name}
                              </p>
                              {doc.verified && (
                                <Shield className="w-3 h-3 text-blue-500 flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>{doc.type.toUpperCase()}</span>
                              <span>{doc.size}</span>
                              <span>{doc.uploadDate}</span>
                            </div>
                          </div>

                          {/* Preview Icon */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviewDocument(doc.id);
                            }}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Upload New File Block */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mb-6">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">Can't find the file you need?</p>
          <button
            onClick={handleUploadNewFile}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Upload New File
          </button>
        </div>

        {/* Selected Documents Summary */}
        {selectedCount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">
                {selectedCount} document{selectedCount !== 1 ? 's' : ''} selected
              </p>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {selectedDocs.slice(0, 5).map((docId) => {
                const doc = vaultDocuments.find(d => d.id === docId);
                return doc ? (
                  <p key={docId} className="text-xs text-blue-700 truncate">
                    {doc.name}
                  </p>
                ) : null;
              })}
              {selectedCount > 5 && (
                <p className="text-xs text-blue-700">
                  +{selectedCount - 5} more documents
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Fixed Bottom Action Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 py-3 px-6 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleContinue}
              disabled={selectedCount === 0}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-colors ${
                selectedCount > 0
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue
              {selectedCount > 0 && <span className="ml-2">({selectedCount})</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDocumentsFromVault;
