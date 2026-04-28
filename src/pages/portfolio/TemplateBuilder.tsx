import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import DocumentItem from '../../components/portfolio/DocumentItem';

interface DocumentItem {
  documentId: string;
  name: string;
}

interface PortfolioData {
  type: string;
  profile: {
    fullName: string;
    email: string;
    phone: string;
    role: string;
    summary: string;
  };
  documents: {
    personalProofs: DocumentItem[];
    academic: DocumentItem[];
    internships: DocumentItem[];
    certifications: DocumentItem[];
    exams: DocumentItem[];
    others: DocumentItem[];
  };
  selectedDocuments?: any;
}

interface TemplateBuilderProps {
  initialData?: PortfolioData;
  mode?: 'create' | 'edit';
  onSave?: (data: PortfolioData) => Promise<void>;
}

const TemplateBuilder: React.FC<TemplateBuilderProps> = ({ 
  initialData, 
  mode = 'create', 
  onSave 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [type, setType] = useState<string>('masters');
  const [showDocumentModal, setShowDocumentModal] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedDocs, setSelectedDocs] = useState<any>({});

  // Initialize with initialData in edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      console.log("EDIT MODE: Initializing with initialData", initialData);
      setType(initialData.type || 'masters');
      setSelectedDocs(initialData.selectedDocuments || {});
    } else {
      // Extract type from URL for create mode
      const params = new URLSearchParams(location.search);
      const urlType = params.get('type');
      if (urlType) {
        setType(urlType);
      }
    }
  }, [mode, initialData, location.search]);

  // Handle selected documents from vault
  useEffect(() => {
    try {
      const stored = localStorage.getItem("selectedDocuments");
      
      if (stored) {
        const selectedDocuments = JSON.parse(stored);
        
        // Validate structure
        if (!selectedDocuments || typeof selectedDocuments !== 'object') {
          console.error('Invalid selectedDocuments structure');
          return;
        }
        
        // Map field to category and section
        const fieldMapping = {
          // Personal Proofs
          'resume': { category: 'personalProofs', section: 'personalProofs' },
          'aadhar': { category: 'personalProofs', section: 'personalProofs' },
          'passport': { category: 'personalProofs', section: 'personalProofs' },
          'photo': { category: 'personalProofs', section: 'personalProofs' },
          // Academic
          '10th_certificate': { category: 'academic', section: 'academic' },
          '12th_certificate': { category: 'academic', section: 'academic' },
          'degree_certificate': { category: 'academic', section: 'academic' },
          'semester_scorecards': { category: 'academic', section: 'academic' },
          // Internships
          'offer_letter': { category: 'internships', section: 'internships' },
          'completion_certificate': { category: 'internships', section: 'internships' },
          // Certifications
          'courses': { category: 'certifications', section: 'certifications' },
          'workshops': { category: 'certifications', section: 'certifications' },
          'hackathons': { category: 'certifications', section: 'certifications' },
          // Default
          'other': { category: 'others', section: 'others' }
        };
        
        // Process all selected documents
        const updatedSelectedDocs: any = {};
        const updatedPortfolioDocs: any = {
          personalProofs: [],
          academic: [],
          internships: [],
          certifications: [],
          exams: [],
          others: []
        };
        
        Object.entries(selectedDocuments).forEach(([field, doc]: [string, any]) => {
          if (!doc || !doc.id || !doc.name) {
            console.error('Invalid document in field:', field);
            return;
          }
          
          const mapping = fieldMapping[field as keyof typeof fieldMapping] || fieldMapping.other;
          
          // Update selected docs state for this field
          updatedSelectedDocs[field] = doc;
          
          // Add to portfolio data
          const portfolioDoc = {
            documentId: doc.id,
            name: doc.name
          };
          
          if (updatedPortfolioDocs[mapping.section]) {
            updatedPortfolioDocs[mapping.section].push(portfolioDoc);
          }
        });
        
        // Update states with all documents
        setSelectedDocs(updatedSelectedDocs);
        setPortfolioData(prev => ({
          ...prev,
          documents: updatedPortfolioDocs
        }));
        
        console.log('All documents processed successfully:', Object.keys(updatedSelectedDocs));
      }
    } catch (error) {
      console.error('Error processing selected documents:', error);
    }
  }, []);

  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    type,
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

  // Mock vault data for demo
  const mockVaultFiles = [
    { id: '1', name: 'Resume.pdf', type: 'pdf' },
    { id: '2', name: 'Aadhar Card.pdf', type: 'pdf' },
    { id: '3', name: 'Passport.pdf', type: 'pdf' },
    { id: '4', name: '10th Marksheet.jpg', type: 'image' },
    { id: '5', name: '12th Certificate.pdf', type: 'pdf' },
    { id: '6', name: 'Degree Certificate.pdf', type: 'pdf' },
    { id: '7', name: 'Internship Letter.pdf', type: 'pdf' },
    { id: '8', name: 'Course Certificate.pdf', type: 'pdf' },
    { id: '9', name: 'GRE Score Report.pdf', type: 'pdf' },
    { id: '10', name: 'IELTS Certificate.pdf', type: 'pdf' }
  ];

  const handleProfileChange = (field: string, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }));
  };

  const handleDocumentSelect = (section: string) => {
    // Navigate to vault selection
    navigate('/select-from-vault');
  };

  const handleRemoveDocument = (section: string, documentId: string) => {
    setPortfolioData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [section]: prev.documents[section as keyof typeof prev.documents].filter(
          doc => doc.documentId !== documentId
        )
      }
    }));
  };

  const handleReviewSubmit = () => {
    if (mode === 'edit' && onSave) {
      // In edit mode, call the onSave function directly
      onSave(portfolioData);
    } else {
      // In create mode, navigate to review page
      navigate('/portfolio/review', { state: portfolioData });
    }
  };

  // Check if any documents are selected
  const hasSelectedDocuments = () => {
    return Object.values(selectedDocs).some(doc => doc !== null && doc !== undefined);
  };

  const handleBack = () => {
    navigate('/portfolio/create');
  };

  
  // Personal Info Section
  const PersonalInfoSection = () => (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={portfolioData.profile.fullName}
            onChange={(e) => handleProfileChange('fullName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={portfolioData.profile.email}
            onChange={(e) => handleProfileChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={portfolioData.profile.phone}
            onChange={(e) => handleProfileChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <input
            type="text"
            value={portfolioData.profile.role}
            onChange={(e) => handleProfileChange('role', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Student, Professional"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
          <textarea
            value={portfolioData.profile.summary}
            onChange={(e) => handleProfileChange('summary', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Brief summary about yourself"
          />
        </div>
      </div>
    </div>
  );

  // Document Section Component
  const DocumentSection = ({ title, sectionKey, items }: { title: string; sectionKey: keyof typeof portfolioData.documents; items: string[] }) => (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => {
          // Map item name to field name
          const itemToFieldMap: { [key: string]: string } = {
            // Personal Proofs
            'Resume': 'resume',
            'Aadhar': 'aadhar',
            'Passport': 'passport',
            'Photo': 'photo',
            // Academic
            '10th Certificate': '10th_certificate',
            '12th Certificate': '12th_certificate',
            'Degree Certificate': 'degree_certificate',
            'Semester Scorecards': 'semester_scorecards',
            // Internships
            'Offer Letter': 'offer_letter',
            'Completion Certificate': 'completion_certificate',
            'Work Proof': 'completion_certificate',
            // Certifications
            'Courses': 'courses',
            'Workshops': 'workshops',
            'Hackathons': 'hackathons',
            // Other
            '+ Add More': 'other'
          };
          
          const fieldName = itemToFieldMap[item] || item.toLowerCase().replace(/\s+/g, '_');
          const selectedDoc = selectedDocs[fieldName];
          const uploadedDoc = portfolioData.documents[sectionKey].find(doc => doc.name === selectedDoc?.name);
          
          return (
            <DocumentItem
              key={item}
              title={item}
              value={selectedDoc?.name || uploadedDoc?.name}
              uploaded={!!selectedDoc || !!uploadedDoc}
              onSelect={() => handleDocumentSelect(sectionKey)}
            />
          );
        })}
      </div>
    </div>
  );

  // Error boundary fallback
  if (!portfolioData || !portfolioData.documents) {
    return (
      <div className="page">
        <div className="page-content">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Portfolio</h3>
            <p className="text-gray-600 mb-6">Please wait while we set up your portfolio...</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
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
              <h1 className="text-xl font-bold text-gray-900">
                {type === 'masters' ? 'Masters' : type === 'personal' ? 'Personal' : 'Academic'} Portfolio
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <PersonalInfoSection />
          
          <DocumentSection
            title="Personal Proofs"
            sectionKey="personalProofs"
            items={['Resume', 'Aadhar', 'Passport', 'Photo']}
          />
          
          <DocumentSection
            title="Academic"
            sectionKey="academic"
            items={['10th Certificate', '12th Certificate', 'Degree Certificate', 'Semester Scorecards']}
          />
          
          <DocumentSection
            title="Internships"
            sectionKey="internships"
            items={['Offer Letter', 'Completion Certificate', 'Work Proof']}
          />
          
          <DocumentSection
            title="Certifications"
            sectionKey="certifications"
            items={['Courses', 'Workshops', 'Hackathons']}
          />
          
          <DocumentSection
            title="Other Documents"
            sectionKey="others"
            items={['+ Add More']}
          />
          
          {/* Review & Submit Button */}
          <div className="mt-6 mb-4">
            <button
              onClick={handleReviewSubmit}
              disabled={!hasSelectedDocuments()}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-colors shadow-lg ${
                hasSelectedDocuments()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Review & Submit
            </button>
            {!hasSelectedDocuments() && (
              <p className="text-center text-sm text-gray-500 mt-2">
                Please select at least one document to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateBuilder;
