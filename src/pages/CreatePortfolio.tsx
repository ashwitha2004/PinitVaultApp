import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, Eye, Star, TrendingUp } from 'lucide-react';

const CreatePortfolio: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedType, setSelectedType] = useState<'personal' | 'academic' | 'professional' | 'masters' | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const state = location.state as { selectedType?: 'personal' | 'academic' | 'professional' | 'masters' };
    if (state?.selectedType) {
      setSelectedType(state.selectedType);
    } else {
      // If no type selected, go back to type selection
      navigate('/select-type');
    }
  }, [location.state, navigate]);

  const templates = [
    {
      id: 'clean-resume',
      name: 'Clean Resume Style',
      description: 'Professional and clean layout perfect for traditional resumes',
      thumbnail: '/api/placeholder/300/200',
      tags: ['Minimalist', 'ATS Friendly'],
      recommended: true,
      popular: false
    },
    {
      id: 'card-modern',
      name: 'Card-Based Modern',
      description: 'Modern card-based design with interactive elements',
      thumbnail: '/api/placeholder/300/200',
      tags: ['Interactive', 'Modern'],
      recommended: false,
      popular: true
    },
    {
      id: 'professional-grid',
      name: 'Professional Grid',
      description: 'Grid-based layout showcasing multiple sections clearly',
      thumbnail: '/api/placeholder/300/200',
      tags: ['Block Grid', 'Professional'],
      recommended: false,
      popular: false
    }
  ];

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleContinue = () => {
    if (selectedTemplate && selectedType) {
      navigate('/add-documents-from-vault', { 
        state: { 
          selectedType, 
          selectedTemplate 
        } 
      });
    }
  };

  const handleBack = () => {
    navigate('/select-type');
  };

  const handlePreviewTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      alert(`Template preview for "${template.name}" coming soon!`);
    }
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
            <h1 className="text-lg font-semibold text-gray-900">Select Template</h1>
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
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium">
                4
              </div>
            </div>
          </div>
          
          <p className="text-center text-sm text-gray-600">Step 2 of 4</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Template Cards */}
        <div className="space-y-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`bg-white rounded-xl border-2 overflow-hidden transition-all cursor-pointer ${
                selectedTemplate === template.id
                  ? 'border-blue-500 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              {/* Thumbnail */}
              <div className="relative h-32 bg-gray-100">
                <img 
                  src={template.thumbnail} 
                  alt={template.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback for broken images
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%236b7280"%3ETemplate Preview%3C/text%3E%3C/svg%3E';
                  }}
                />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {template.recommended && (
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Recommended
                    </div>
                  )}
                  {template.popular && (
                    <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Popular
                    </div>
                  )}
                </div>
                
                {/* Preview Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviewTemplate(template.id);
                  }}
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:bg-white transition-colors"
                >
                  <Eye className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  {selectedTemplate === template.id && (
                    <div className="w-6 h-6 rounded-full border-2 border-blue-500 bg-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Fixed Bottom Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleContinue}
            disabled={!selectedTemplate}
            className={`w-full py-3 px-6 rounded-xl font-medium transition-colors ${
              selectedTemplate
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePortfolio;
