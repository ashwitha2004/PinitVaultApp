import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import DocumentItem from '../../components/portfolio/DocumentItem';
import PersonalInfoForm from '../../components/portfolio/PersonalInfoForm';
import { useDocument } from '../../context/DocumentContext';

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
  selectedDocuments: {
    resume?: any;
    aadhaar?: any;
    passport?: any;
    photo?: any;
    '10th_certificate'?: any;
    '12th_certificate'?: any;
    degree_certificate?: any;
    semester_scorecards?: any;
    offer_letter?: any;
    completion_certificate?: any;
    courses?: any;
    workshops?: any;
    hackathons?: any;
    other?: any;
  };
}

interface TemplateBuilderProps {
  initialData?: PortfolioData;
  mode?: 'create' | 'edit';
  onSave?: (data: PortfolioData) => Promise<void>;
}

const TemplateBuilder = memo(({ mode = 'create', initialData, onSave }: TemplateBuilderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedDoc, clearSelectedDoc } = useDocument();
  const [type, setType] = useState<string>('masters');
  const [showDocumentModal, setShowDocumentModal] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedDocs, setSelectedDocs] = useState({});

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
    },
    selectedDocuments: {}
  });

  // Initialize with initialData in edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      console.log("EDIT MODE: Initializing with initialData", initialData);
      setType(initialData.type || 'masters');
      // FIX: Use merge pattern instead of overwriting
      setSelectedDocs(prev => ({
        ...prev,
        ...(initialData.selectedDocuments || {})
      }));
    } else {
      // Load saved data from localStorage for create mode
      const savedData = localStorage.getItem("portfolioBuilderData");
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          console.log("Loading saved data:", parsed);
          
          // Load saved profile data
          if (parsed.profile) {
            setPortfolioData(prev => ({
              ...prev,
              profile: { ...prev.profile, ...parsed.profile }
            }));
          }
          
          // Load saved selected documents
          if (parsed.selectedDocs) {
            // FIX: Use merge pattern instead of overwriting
            setSelectedDocs(prev => ({
              ...prev,
              ...parsed.selectedDocs
            }));
            console.log("Loaded saved selectedDocs:", parsed.selectedDocs);
          }
          
          // Load saved type
          if (parsed.type) {
            setType(parsed.type);
          }
        } catch (error) {
          console.error("Error loading saved data:", error);
        }
      }
      
      // Extract type from URL for create mode
      const params = new URLSearchParams(location.search);
      const urlType = params.get('type');
      if (urlType) {
        setType(urlType);
      }
    }
  }, [mode, initialData, location.search]);
  
  // Save state to localStorage on changes
  useEffect(() => {
    // Only save in create mode, not edit mode
    if (mode === 'create') {
      const dataToSave = {
        profile: portfolioData.profile,
        selectedDocs: selectedDocs,
        type: type
      };
      console.log("Saving data to localStorage:", dataToSave);
      localStorage.setItem("portfolioBuilderData", JSON.stringify(dataToSave));
    }
  }, [portfolioData.profile, selectedDocs, type, mode]);

  // Debug useEffect to track selectedDocs changes
  useEffect(() => {
    console.log("SELECTED DOCS STATE:", selectedDocs);
    console.log("SELECTED DOCS KEYS:", Object.keys(selectedDocs));
    console.log("SELECTED DOCS VALUES:", Object.values(selectedDocs));
  }, [selectedDocs]);

  // Handle document selection from vault
  const handleSelectDocument = useCallback((fieldName: string, item: string) => {
    console.log("Selected:", fieldName, item); // Debug logging
    
    setSelectedDocs(prev => ({
      ...prev,
      [fieldName]: item
    }));
  }, []);

  // Handle selected documents from vault using global state
  useEffect(() => {
    if (selectedDoc?.file && selectedDoc?.type) {
      console.log("SELECTED DOC:", selectedDoc); // Debug logging
      
      const { file, type } = selectedDoc;
      
      // Debug: Check what type we're getting
      console.log("DEBUG - Type received:", type);
      console.log("DEBUG - File received:", file);
      
      // Map type to correct document category
      const categoryMapping: { [key: string]: 'personalProofs' | 'academic' | 'internships' | 'certifications' | 'exams' | 'others' } = {
        'resume': 'personalProofs',
        'aadhaar': 'personalProofs', 
        'aadhar': 'personalProofs',
        'passport': 'personalProofs',
        'photo': 'personalProofs',
        '10th_certificate': 'academic',
        '12th_certificate': 'academic',
        'degree_certificate': 'academic',
        'semester_scorecards': 'academic',
        'offer_letter': 'internships',
        'completion_certificate': 'internships',
        'work_proof': 'internships',
        'courses': 'certifications',
        'workshops': 'certifications',
        'hackathons': 'certifications',
        'other': 'others'
      };
      
      const category = categoryMapping[type] || 'others';
      
      console.log("DEBUG - Category:", category);
      
      // Create document item with correct structure
      const documentItem = {
        documentId: file.id,
        name: file.name
      };
      
      // Update portfolio data with correct category
      setPortfolioData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [category]: [...prev.documents[category], documentItem]
        }
      }));
      
      // Update selectedDocs state - Include base64 URL for view/download
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result;
          
          setSelectedDocs(prev => {
            const updated = {
              ...prev,
              [type]: {
                name: file.name,
                url: base64,
                id: (file as any).id
              }
            };
            console.log("DEBUG - Updated selectedDocs with URL:", updated);
            return updated;
          });
        };
        reader.readAsDataURL(file);
      } else {
        // Already processed (from state / localStorage)
        setSelectedDocs(prev => {
          const updated = {
            ...prev,
            [type]: file
          };
          console.log("DEBUG - Using existing processed file:", updated);
          return updated;
        });
      }
      
      // Clear selected document to prevent re-applying
      clearSelectedDoc();
    }
  }, [selectedDoc]);

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

  const handleProfileChange = useCallback((field: string, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }));
  }, []);

  const handleDocumentSelect = useCallback((section: string) => {
    // Navigate to vault selection with document type
    navigate('/select-from-vault', { state: { type: section } });
  }, [navigate]);

  
  const handleRemoveDocument = useCallback((section: string, documentId: string) => {
    setPortfolioData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [section]: prev.documents[section as keyof typeof prev.documents].filter(doc => doc.documentId !== documentId)
      }
    }));
  }, []);

  // Helper function to get document details from vault
  const getDocumentItem = useCallback((docId: unknown): DocumentItem | null => {
    if (!docId) return null;
    const docIdStr = String(docId);
    try {
      const vaultFiles = JSON.parse(localStorage.getItem('vaultFiles') || '[]');
      const doc = vaultFiles.find((d: any) => d.id === docIdStr || d === docIdStr);
      if (doc) {
        // If doc is already a DocumentItem object
        if (typeof doc === 'object' && doc.documentId && doc.name) {
          return doc;
        }
        // If doc is a vault file object with id and name
        if (typeof doc === 'object' && doc.id && doc.name) {
          return { documentId: doc.id, name: doc.name };
        }
        // If doc is just an ID string, try to find it again
        if (typeof doc === 'string') {
          const foundDoc = vaultFiles.find((d: any) => d.id === doc);
          if (foundDoc) {
            return { documentId: foundDoc.id, name: foundDoc.name };
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting document item:', error);
      return null;
    }
  }, []);

  // Helper function to transform selectedDocs to sections structure
  const buildSections = (selectedDocs: Record<string, any>) => {
    const sections: { title: string; documents: any[] }[] = [];

    const mapping = {
      personalProofs: ["resume", "aadhaar", "aadhar", "passport", "photo"],
      academic: ["10th_certificate", "12th_certificate", "degree_certificate", "semester_scorecards"],
      internships: ["offer_letter", "completion_certificate", "work_proof"],
      certifications: ["courses", "workshops", "hackathons"],
      other: ["other"]
    };

    Object.keys(mapping).forEach((sectionKey) => {
      const docs = mapping[sectionKey as keyof typeof mapping]
        .map((key) => selectedDocs[key])
        .filter(Boolean); // remove empty

      if (docs.length > 0) {
        sections.push({
          title: sectionKey,
          documents: docs
        });
      }
    });

    return sections;
  };

  const handleReviewSubmit = useCallback(() => {
    // Transform selectedDocs into the correct documents structure
    const transformedDocuments = {
      personalProofs: Object.entries(selectedDocs)
        .filter(([key]) => ['aadhaar', 'passport', 'photo'].includes(key))
        .map(([_, value]) => getDocumentItem(value))
        .filter((item): item is DocumentItem => item !== null),
      academic: Object.entries(selectedDocs)
        .filter(([key]) => ['10th_certificate', '12th_certificate', 'degree_certificate', 'semester_scorecards'].includes(key))
        .map(([_, value]) => getDocumentItem(value))
        .filter((item): item is DocumentItem => item !== null),
      internships: Object.entries(selectedDocs)
        .filter(([key]) => ['offer_letter', 'completion_certificate'].includes(key))
        .map(([_, value]) => getDocumentItem(value))
        .filter((item): item is DocumentItem => item !== null),
      certifications: Object.entries(selectedDocs)
        .filter(([key]) => ['courses', 'workshops'].includes(key))
        .map(([_, value]) => getDocumentItem(value))
        .filter((item): item is DocumentItem => item !== null),
      exams: Object.entries(selectedDocs)
        .filter(([key]) => ['hackathons'].includes(key))
        .map(([_, value]) => getDocumentItem(value))
        .filter((item): item is DocumentItem => item !== null),
      others: Object.entries(selectedDocs)
        .filter(([key]) => !['resume', 'aadhaar', 'passport', 'photo', '10th_certificate', '12th_certificate', 'degree_certificate', 'semester_scorecards', 'offer_letter', 'completion_certificate', 'courses', 'workshops', 'hackathons'].includes(key))
        .map(([_, value]) => getDocumentItem(value))
        .filter((item): item is DocumentItem => item !== null)
    };

    // Build sections for share/view compatibility
    const sections = buildSections(selectedDocs);

    // Include both documents and sections for compatibility
    const finalData = {
      ...portfolioData,
      documents: transformedDocuments,
      sections: sections, // ✅ IMPORTANT: Add sections structure
      selectedDocs: selectedDocs // Keep for backward compatibility
    };

    console.log("FINAL SAVED DATA:", finalData); // Debug logging

    if (mode === 'edit' && onSave) {
      // In edit mode, call the onSave function directly
      onSave(finalData);
    } else {
      // In create mode, navigate to review page with complete data
      navigate('/portfolio/review', { 
        state: { 
          personalInfo: portfolioData.profile,
          documents: transformedDocuments
        } 
      });
    }
    
    // Clear localStorage after successful submission
    if (mode === 'create') {
      localStorage.removeItem("portfolioBuilderData");
      console.log("Cleared localStorage after submission");
    }
  }, [mode, onSave, portfolioData, selectedDocs, navigate]);

  const hasSelectedDocuments = useCallback(() => {
    const selectedDocs = portfolioData.documents;
    return Object.values(selectedDocs).some(doc => doc !== null && doc !== undefined);
  }, [portfolioData.documents]);

  const handleBack = useCallback(() => {
    navigate('/portfolio/create');
  }, [navigate]);

  
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
            'Work Proof': 'work_proof',
            // Certifications
            'Courses': 'courses',
            'Workshops': 'workshops',
            'Hackathons': 'hackathons',
            // Other
            '+ Add More': 'other'
          };
          
          const fieldName = itemToFieldMap[item] || item.toLowerCase().replace(/\s+/g, '_');
          const selectedDoc = (selectedDocs as Record<string, any>)[fieldName];
          
          return (
            <DocumentItem
              key={`${sectionKey}-${item}`}
              title={item}
              value={selectedDoc?.name || ''}
              uploaded={!!selectedDoc}
              onSelect={() => handleDocumentSelect(fieldName)}
            />
          );
        })}
      </div>
    </div>
  );

  // Error boundary fallback
  if (!portfolioData || !portfolioData.documents) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
        <p className="text-gray-600 mb-6">Unable to load portfolio data</p>
        <button
          onClick={() => navigate('/portfolio/create')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Over
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
            <h1 className="text-xl font-bold text-gray-900">
              {mode === 'edit' ? 'Edit Portfolio' : 'Create Portfolio'}
            </h1>
          </div>
        </div>
      </div>

        {/* Content */}
        <div>
          <PersonalInfoForm 
            data={portfolioData.profile}
            onChange={handleProfileChange}
          />
          
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
      </>
  );
});

export default TemplateBuilder;
