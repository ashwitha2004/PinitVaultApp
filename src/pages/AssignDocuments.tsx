import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, FileText, Check, ChevronDown } from 'lucide-react';
import Header from '../components/Header';
import type { Portfolio, PortfolioSection } from '../types/Portfolio';

interface VaultDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string;
  uploadedAt: string;
}

const AssignDocuments = () => {
  const navigate = useNavigate();
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [vaultDocuments, setVaultDocuments] = useState<VaultDocument[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [documentAssignments, setDocumentAssignments] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignmentDropdown, setShowAssignmentDropdown] = useState<string | null>(null);

  useEffect(() => {
    // Load portfolio from localStorage
    const portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
    const foundPortfolio = portfolios.find((p: Portfolio) => p.id === portfolioId);
    
    if (foundPortfolio) {
      setPortfolio(foundPortfolio);
      // Load existing document assignments
      const assignments: Record<string, string> = {};
      foundPortfolio.sections.forEach((section: PortfolioSection) => {
        section.documents.forEach((docId: string) => {
          assignments[docId] = section.title;
        });
      });
      setDocumentAssignments(assignments);
    } else {
      navigate('/portfolios');
    }

    // Load vault documents
    const documents = JSON.parse(localStorage.getItem('vaultFiles') || '[]');
    setVaultDocuments(documents);
  }, [portfolioId, navigate]);

  const handleDocumentToggle = (documentId: string) => {
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(documentId)) {
        newSet.delete(documentId);
      } else {
        newSet.add(documentId);
      }
      return newSet;
    });
  };

  const handleDocumentAssignment = (documentId: string, sectionTitle: string) => {
    setDocumentAssignments(prev => ({
      ...prev,
      [documentId]: sectionTitle
    }));
    setShowAssignmentDropdown(null);
  };

  const handleAssignAllSelected = () => {
    const newAssignments: Record<string, string> = {};
    selectedDocuments.forEach(docId => {
      newAssignments[docId] = documentAssignments[docId] || portfolio?.sections[0]?.title || '';
    });
    setDocumentAssignments(newAssignments);
  };

  const getFilteredDocuments = () => {
    if (!searchQuery) return vaultDocuments;
    
    return vaultDocuments.filter(doc =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getDocumentIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('video')) return '🎥';
    return '📄';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSaveAssignments = () => {
    if (!portfolio || Object.keys(documentAssignments).length === 0) {
      alert('Please assign at least one document to a section');
      return;
    }

    // Update portfolio sections with assigned documents
    const updatedSections = portfolio.sections.map(section => {
      // Add documents assigned to this section
      const sectionDocuments = Object.keys(documentAssignments)
        .filter(docId => documentAssignments[docId] === section.title);
      
      return {
        ...section,
        documents: sectionDocuments
      };
    });

    const updatedPortfolio = {
      ...portfolio,
      sections: updatedSections,
      updatedAt: new Date().toISOString()
    };

    // Save to localStorage
    const portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
    const updatedPortfolios = portfolios.map((p: Portfolio) => 
      p.id === portfolioId ? updatedPortfolio : p
    );
    localStorage.setItem('portfolios', JSON.stringify(updatedPortfolios));

    setPortfolio(updatedPortfolio);
    alert('Document assignments saved successfully!');
    navigate(`/portfolio/${portfolioId}`);
  };

  const selectedCount = selectedDocuments.size;
  const assignedCount = Object.keys(documentAssignments).length;

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-200"></div>
          <p className="mt-4 text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showWelcome={false} />
      
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Assign Documents</h1>
            <span className="text-sm text-gray-600">{portfolio.name}</span>
          </div>
          
          <div className="text-sm text-gray-600">
            {selectedCount} selected • {assignedCount} assigned
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search documents..."
            />
          </div>
        </div>

        {/* Documents Grid */}
        <div className="bg-white rounded-2xl shadow-sm mb-6">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Documents from Vault</h3>
              
              {/* Select All Controls */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const allDocIds = new Set(getFilteredDocuments().map(doc => doc.id));
                    setSelectedDocuments(allDocIds);
                  }}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Select All
                </button>
                <button
                  onClick={() => setSelectedDocuments(new Set())}
                  className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  Deselect All
                </button>
              </div>
            </div>

            {getFilteredDocuments().length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Documents Found</h4>
                <p className="text-gray-600">
                  {searchQuery ? 'No documents match your search' : 'No documents in your Vault'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {getFilteredDocuments().map((document) => (
                  <div key={document.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.has(document.id)}
                          onChange={() => handleDocumentToggle(document.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-lg">{getDocumentIcon(document.type)}</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{document.name}</h4>
                              <p className="text-sm text-gray-600">
                                {document.type} • {formatFileSize(document.size)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Assignment Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setShowAssignmentDropdown(
                            showAssignmentDropdown === document.id ? null : document.id
                          )}
                          className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-1"
                        >
                          <span>
                            {documentAssignments[document.id] || 'Unassigned'}
                          </span>
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        
                        {showAssignmentDropdown === document.id && (
                          <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <div className="py-1">
                              {portfolio.sections.map((section) => (
                                <button
                                  key={section.title}
                                  onClick={() => handleDocumentAssignment(document.id, section.title)}
                                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm ${
                                    documentAssignments[document.id] === section.title
                                      ? 'bg-blue-50 text-blue-700'
                                      : 'text-gray-700'
                                  }`}
                                >
                                  {section.title}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Assignment Status */}
                    <div className="text-xs text-gray-500">
                      {selectedDocuments.has(document.id) && (
                        <span className="text-blue-600">
                          {documentAssignments[document.id] ? `Assigned to ${documentAssignments[document.id]}` : 'Selected'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-4">
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/portfolio/select-documents/${portfolioId}`)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Selection
              </button>
              
              <button
                onClick={handleAssignAllSelected}
                disabled={selectedDocuments.size === 0}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign All Selected
              </button>
              
              <button
                onClick={handleSaveAssignments}
                disabled={assignedCount === 0}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Assignments
              </button>
            </div>
            
            {/* Summary */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Assignment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Documents:</span>
                  <span className="font-medium text-gray-900">{vaultDocuments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected:</span>
                  <span className="font-medium text-gray-900">{selectedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Assigned:</span>
                  <span className="font-medium text-gray-900">{assignedCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignDocuments;
