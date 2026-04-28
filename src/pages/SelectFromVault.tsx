import { useNavigate, useLocation } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";

const SelectFromVault = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedType = location.state?.type;

  console.log("Selected Type:", selectedType); // Debug logging

  const documents = JSON.parse(localStorage.getItem("vaultDocuments") || "[]");

  const handleSelect = (doc: any) => {
    // Safe data validation
    if (!doc || !doc.id || !doc.name) {
      console.error('Invalid document selected');
      return;
    }

    // Map document to specific field
    const field = mapDocumentToField(doc.name);
    
    // Read existing selected documents
    const existingData = localStorage.getItem("selectedDocuments");
    let selectedDocuments = existingData ? JSON.parse(existingData) : {};
    
    // Initialize empty object if needed
    if (!selectedDocuments || typeof selectedDocuments !== 'object') {
      selectedDocuments = {};
    }
    
    // Update only the specific field (merge logic)
    selectedDocuments[field] = {
      id: doc.id,
      name: doc.name,
      type: doc.type || 'pdf',
      field: field,
      originalDoc: doc
    };
    
    // Save merged data
    localStorage.setItem("selectedDocuments", JSON.stringify(selectedDocuments));
    
    // Prepare payload with file and type
    const payload = { 
      selectedFile: doc,
      type: selectedType || field 
    };
    
    // Store in sessionStorage as backup
    sessionStorage.setItem("selectedDoc", JSON.stringify(payload));
    
    console.log("Navigating with payload:", payload);
    
    // Navigate explicitly back to template builder with type
    navigate("/portfolio/create/template", { 
      state: payload
    });
  };

  // Map document name to specific field
  const mapDocumentToField = (docName: string): string => {
    const name = docName.toLowerCase();
    
    // Personal Proofs - Specific fields
    if (name.includes('resume') || name.includes('cv')) return 'resume';
    if (name.includes('aadhar') || name.includes('aadhaar')) return 'aadhar';
    if (name.includes('passport')) return 'passport';
    if (name.includes('photo') || name.includes('picture')) return 'photo';
    
    // Academic - Specific fields
    if (name.includes('10th') || name.includes('ssc')) return '10th_certificate';
    if (name.includes('12th') || name.includes('hsc')) return '12th_certificate';
    if (name.includes('degree') || name.includes('graduation')) return 'degree_certificate';
    if (name.includes('semester') || name.includes('scorecard')) return 'semester_scorecards';
    
    // Internships - Specific fields
    if (name.includes('internship') || name.includes('offer')) return 'offer_letter';
    if (name.includes('completion') || name.includes('work')) return 'completion_certificate';
    
    // Certifications - Specific fields
    if (name.includes('certificate') || name.includes('course')) return 'courses';
    if (name.includes('workshop')) return 'workshops';
    if (name.includes('hackathon')) return 'hackathons';
    
    // Default
    return 'other';
  };

  return (
    <PageContainer>
      <div className="vault-list">
        <h2 className="text-lg font-semibold mb-4">Select Document</h2>

        {documents.length === 0 ? (
          <p className="text-gray-500">No documents in vault</p>
        ) : (
          documents.map((doc: any) => (
            <div
              key={doc.id}
              className="p-3 mb-3 bg-gray-100 rounded-lg flex justify-between items-center"
            >
              <span>{doc.name}</span>

              <button
                onClick={() => handleSelect(doc)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Select
              </button>
            </div>
          ))
        )}
      </div>
    </PageContainer>
  );
};

export default SelectFromVault;
