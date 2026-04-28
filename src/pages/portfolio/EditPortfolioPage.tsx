import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import TemplateBuilder from './TemplateBuilder';
import { updatePortfolio } from '../../services/portfolioService';

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
    personalProofs: any[];
    academic: any[];
    internships: any[];
    certifications: any[];
    exams: any[];
    others: any[];
  };
  selectedDocuments: any;
}

const EditPortfolioPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    console.log("=== EDIT PORTFOLIO DEBUG START ===");
    console.log("EDIT ID from URL:", id);
    console.log("EDIT ID type:", typeof id);
    
    if (!id) {
      console.log("ERROR: No ID found in URL params");
      setLoading(false);
      return;
    }
    
    // Fetch portfolio from localStorage
    const rawData = localStorage.getItem("portfolios");
    console.log("Raw localStorage data:", rawData);
    
    if (!rawData) {
      console.log("ERROR: No portfolios found in localStorage");
      setLoading(false);
      return;
    }
    
    const data = JSON.parse(rawData);
    console.log("Parsed portfolios array:", data);
    console.log("Number of portfolios:", data.length);
    
    // Log each portfolio ID for debugging
    data.forEach((p: any, index: number) => {
      console.log(`Portfolio ${index}: ID=${p.id}, Type=${typeof p.id}, Name=${p.name}`);
    });
    
    const found = data.find((p: any) => String(p.id) === String(id));
    console.log("FOUND portfolio:", found);
    console.log("=== EDIT PORTFOLIO DEBUG END ===");
    
    if (found) {
      // Transform the portfolio data to match TemplateBuilder structure
      const transformedData: PortfolioData = {
        type: found.type || 'Personal',
        profile: found.profile || {
          fullName: '',
          email: '',
          phone: '',
          role: '',
          summary: ''
        },
        documents: found.documents || {
          personalProofs: [],
          academic: [],
          internships: [],
          certifications: [],
          exams: [],
          others: []
        },
        selectedDocuments: found.selectedDocuments || {}
      };
      setPortfolioData(transformedData);
    }
    
    setLoading(false);
  }, [id]);

  const handleSave = async (updatedData: PortfolioData) => {
    if (!id) return;
    
    try {
      setSaving(true);
      console.log("SAVING EDITED PORTFOLIO:", updatedData);
      
      // Update portfolio in localStorage
      const res = await updatePortfolio(id, updatedData);
      console.log("UPDATE RESPONSE:", res);
      
      alert("Portfolio updated successfully!");
      navigate(`/portfolio/view/${id}`);
    } catch (error) {
      console.error("ERROR updating portfolio:", error);
      alert("Failed to update portfolio. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-200"></div>
          <p className="mt-4 text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowLeft className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Portfolio not found</h2>
          <p className="text-gray-600 mb-4">The portfolio you're trying to edit doesn't exist.</p>
          <button
            onClick={() => navigate("/portfolio")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Portfolios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/portfolio/view/${id}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Portfolio
            </button>
            <h1 className="text-xl font-bold text-gray-900">Edit Portfolio</h1>
            <button
              onClick={() => handleSave(portfolioData)}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <TemplateBuilder 
          initialData={portfolioData}
          mode="edit"
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default EditPortfolioPage;
