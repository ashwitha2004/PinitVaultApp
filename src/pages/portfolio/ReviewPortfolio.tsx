import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, FileText, User, Award, Briefcase, BookOpen } from 'lucide-react';
import { createPortfolio } from '../../services/portfolioService';

interface SelectedDocument {
  id: string;
  name: string;
  type: string;
  field: string;
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
      // Try to get data from navigation state first
      const stateData = location.state as PortfolioData;
      
      // Load selected documents from localStorage
      const storedDocs = localStorage.getItem("selectedDocuments");
      const selectedDocs = storedDocs ? JSON.parse(storedDocs) : {};
      
      setSelectedDocuments(selectedDocs);
      
      // Use navigation state or create default structure
      if (stateData) {
        setPortfolioData(stateData);
      } else {
        // Create default structure with selected documents
        const defaultData: PortfolioData = {
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
        };
        
        // Map selected documents to portfolio structure
        Object.values(selectedDocs).forEach((doc: SelectedDocument) => {
          if (doc.field.includes('resume') || doc.field.includes('aadhar') || doc.field.includes('passport') || doc.field.includes('photo')) {
            defaultData.documents.personalProofs.push(doc);
          } else if (doc.field.includes('certificate') || doc.field.includes('degree') || doc.field.includes('scorecard')) {
            defaultData.documents.academic.push(doc);
          } else if (doc.field.includes('internship') || doc.field.includes('offer') || doc.field.includes('completion')) {
            defaultData.documents.internships.push(doc);
          } else if (doc.field.includes('course') || doc.field.includes('workshop') || doc.field.includes('hackathon')) {
            defaultData.documents.certifications.push(doc);
          } else {
            defaultData.documents.others.push(doc);
          }
        });
        
        setPortfolioData(defaultData);
      }
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    } finally {
      setLoading(false);
    }
  }, [location.state]);

  const handleBack = () => {
    navigate('/portfolio/create/template');
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting portfolio...");
      
      // Extract document IDs from selected documents
      const documentIds = Object.values(selectedDocuments).map(doc => doc.id).filter(Boolean);
      
      // Create portfolio data for mock service
      const data = {
        name: portfolioData.profile.fullName || `${portfolioData.profile.role || 'Personal'} Portfolio`,
        type: portfolioData.profile.role || 'Personal',
        profile: portfolioData.profile,
        documentIds: documentIds,
        status: 'Active',
        selectedDocuments: selectedDocuments
      };
      
      const res = await createPortfolio(data);
      console.log("Saved:", res.data);
      
      // Clear selected documents after successful submission
      localStorage.removeItem("selectedDocuments");
      
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
    documents, 
    color 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    documents: SelectedDocument[]; 
    color: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      {documents.length === 0 ? (
        <p className="text-gray-500 text-sm">No documents selected</p>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700 flex-1">{doc.name}</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="page">
        <div className="page-content">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⏳</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Review</h3>
            <p className="text-gray-600">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="page">
        <div className="page-content">
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
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-content">
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
              {portfolioData.profile.fullName && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Name</span>
                  <span className="text-sm font-medium text-gray-900">{portfolioData.profile.fullName}</span>
                </div>
              )}
              {portfolioData.profile.email && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="text-sm font-medium text-gray-900">{portfolioData.profile.email}</span>
                </div>
              )}
              {portfolioData.profile.phone && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Phone</span>
                  <span className="text-sm font-medium text-gray-900">{portfolioData.profile.phone}</span>
                </div>
              )}
              {portfolioData.profile.role && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Role</span>
                  <span className="text-sm font-medium text-gray-900">{portfolioData.profile.role}</span>
                </div>
              )}
            </div>
          </div>

          {/* Document Sections */}
          <DocumentSection
            title="Personal Proofs"
            icon={<User className="w-5 h-5 text-blue-600" />}
            documents={portfolioData.documents.personalProofs}
            color="bg-blue-100"
          />

          <DocumentSection
            title="Academic Documents"
            icon={<BookOpen className="w-5 h-5 text-green-600" />}
            documents={portfolioData.documents.academic}
            color="bg-green-100"
          />

          <DocumentSection
            title="Internships"
            icon={<Briefcase className="w-5 h-5 text-purple-600" />}
            documents={portfolioData.documents.internships}
            color="bg-purple-100"
          />

          <DocumentSection
            title="Certifications"
            icon={<Award className="w-5 h-5 text-orange-600" />}
            documents={portfolioData.documents.certifications}
            color="bg-orange-100"
          />

          <DocumentSection
            title="Other Documents"
            icon={<FileText className="w-5 h-5 text-gray-600" />}
            documents={portfolioData.documents.others}
            color="bg-gray-100"
          />

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
      </div>
    </div>
  );
};

export default ReviewPortfolio;
