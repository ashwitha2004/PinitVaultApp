import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, FileText, User, Award, Briefcase, BookOpen } from 'lucide-react';
import { createPortfolio } from '../../services/portfolioService';

interface SelectedDocument {
  id: string;
  name: string;
  type: string;
  field: string;
  data: string | null;
  size: number;
  uploadedAt: string;
}

interface PortfolioData {
  profile: {
    fullName: string;
    email: string;
    phone: string;
    role: string;
    summary: string;
  };
  documents: {
    personalProofs: SelectedDocument[];
    academic: SelectedDocument[];
    internships: SelectedDocument[];
    certifications: SelectedDocument[];
    exams: SelectedDocument[];
    others: SelectedDocument[];
  };
}

const ReviewPortfolio: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<{ [key: string]: SelectedDocument }>({});
  const [loading, setLoading] = useState(true);

  // Load data from localStorage and navigation state
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("portfolioData");
      const stateData = location.state as { personalInfo?: any; documents?: any };
      
      let data: any;
      
      if (storedData) {
        data = JSON.parse(storedData);
      } else if (stateData?.personalInfo || stateData?.documents) {
        data = {
          profile: stateData.personalInfo || {
            fullName: '',
            email: '',
            phone: '',
            role: '',
            summary: ''
          },
          selectedDocs: stateData.documents || {}
        };
      } else {
        // Fallback to empty data structure
        data = {
          profile: {
            fullName: '',
            email: '',
            phone: '',
            role: '',
            summary: ''
          },
          selectedDocs: {}
        };
      }

      console.log("ReviewPortfolio - Loaded data:", data);
      
      // Transform selectedDocs into the expected PortfolioData structure
      const portfolioDataFormatted: PortfolioData = {
        profile: data.profile || {
          fullName: '',
          email: '',
          phone: '',
          role: '',
          summary: ''
        },
        documents: {
          personalProofs: [],
          academic: [],
          internships: [],
          certifications: [],
          exams: [],
          others: []
        }
      };

      setPortfolioData(portfolioDataFormatted);
      setSelectedDocuments(data.selectedDocs || {});
      
      // Store data in localStorage for persistence
      localStorage.setItem("portfolioData", JSON.stringify(data));
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      // Set fallback data on error
      setPortfolioData({
        profile: {
          fullName: '',
          email: '',
          phone: '',
          role: '',
          summary: ''
        },
        documents: {
          personalProofs: [],
          academic: [],
          internships: [],
          certifications: [],
          exams: [],
          others: []
        }
      });
    } finally {
      setLoading(false);
    }
  }, [location.state]);

  const handleBack = () => {
    navigate('/portfolio/create/template');
  };

  const handleView = (doc: SelectedDocument) => {
    if (!doc?.data) {
      console.error('No data available for viewing');
      return;
    }
    try {
      const blob = new Blob([atob(doc.data)], { type: doc.type });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error('Error creating blob URL:', error);
    }
  };

  const handleDownload = (doc: SelectedDocument) => {
    if (!doc?.data) {
      console.error('No data available for download');
      return;
    }
    try {
      const blob = new Blob([atob(doc.data)], { type: doc.type });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.name || 'document';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating download link:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting portfolio...");
      
      if (!portfolioData) {
        alert("No portfolio data available");
        return;
      }
      
      // Extract document IDs from selected documents
      const documentIds = Object.values(selectedDocuments).map(doc => doc.id).filter(Boolean);
      
      // Create portfolio data for mock service
      const data = {
        name: portfolioData.profile?.fullName || `${portfolioData.profile?.role || 'Personal'} Portfolio`,
        type: portfolioData.profile?.role || 'Personal',
        profile: portfolioData.profile,
        documentIds: documentIds,
        status: 'Active',
        selectedDocuments: selectedDocuments
      };
      
      const res = await createPortfolio(data);
      console.log("Saved:", res.data);
      
      // Clear selected documents after successful submission
      localStorage.removeItem("selectedDocuments");
      localStorage.removeItem("portfolioData");
      
      alert("Portfolio created successfully!");
      navigate("/portfolio", { state: { refresh: true } });
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  // Section components
  const DocumentSection = ({ 
    title, 
    icon, 
    color 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    color: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      {Object.keys(selectedDocuments).length === 0 ? (
        <p className="text-gray-500 text-sm">No documents selected</p>
      ) : (
        <div className="space-y-2">
          {Object.entries(selectedDocuments).map(([key, doc]) => (
            <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700 flex-1">{doc.name || (typeof doc === 'string' ? doc : 'Unknown file')}</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">⏳</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Review</h3>
        <p className="text-gray-600">Please wait...</p>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Found</h3>
        <p className="text-gray-600 mb-6">Please complete your portfolio first</p>
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Builder
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-4">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Review Portfolio</h1>
          </div>
        </div>
      </div>

        {/* Content */}
        <div>
          {/* Personal Info Summary */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>
            
            <div className="space-y-2">
              {portfolioData?.profile?.fullName && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Name</span>
                  <span className="text-sm font-medium text-gray-900">{portfolioData.profile.fullName}</span>
                </div>
              )}
              {portfolioData?.profile?.email && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="text-sm font-medium text-gray-900">{portfolioData.profile.email}</span>
                </div>
              )}
              {portfolioData?.profile?.phone && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Phone</span>
                  <span className="text-sm font-medium text-gray-900">{portfolioData.profile.phone}</span>
                </div>
              )}
              {portfolioData?.profile?.role && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Role</span>
                  <span className="text-sm font-medium text-gray-900">{portfolioData.profile.role}</span>
                </div>
              )}
              {portfolioData?.profile?.summary && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Summary</span>
                  <span className="text-sm font-medium text-gray-900">{portfolioData.profile.summary}</span>
                </div>
              )}
              
              {!portfolioData?.profile?.fullName && !portfolioData?.profile?.email && !portfolioData?.profile?.phone && !portfolioData?.profile?.role && !portfolioData?.profile?.summary && (
                <p className="text-gray-500 text-sm text-center py-4">No personal information provided</p>
              )}
            </div>
          </div>

          {/* Document Sections - Show all uploaded documents */}
          {Object.keys(selectedDocuments).length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Uploaded Documents</h3>
              </div>
              
              <div className="space-y-2">
                {Object.entries(selectedDocuments).map(([key, doc]) => (
                  <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">
                        {doc.name || (typeof doc === 'string' ? doc : 'Unknown file')}
                      </span>
                      <div className="text-xs text-gray-500 capitalize">{key.replace('_', ' ')}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.data && (
                        <>
                          <button
                            onClick={() => handleView(doc)}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            title="View document"
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            title="Download document"
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        </>
                      )}
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {Object.keys(selectedDocuments).length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Documents Uploaded</h3>
                <p className="text-gray-600 mb-4">Please upload documents to complete your portfolio</p>
                <button
                  onClick={handleBack}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Documents
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6 mb-4">
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Submit Portfolio
            </button>
          </div>
        </div>
      </>
  );
};

export default ReviewPortfolio;
