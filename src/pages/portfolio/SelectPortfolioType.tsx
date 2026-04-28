import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, GraduationCap, Briefcase } from 'lucide-react';

const SelectPortfolioType: React.FC = () => {
  const navigate = useNavigate();

  const portfolioTypes = [
    {
      id: 'personal',
      name: 'Personal',
      description: 'Showcase your personal achievements and projects',
      icon: User,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      id: 'academic',
      name: 'Academic',
      description: 'Display your academic records and achievements',
      icon: GraduationCap,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      id: 'masters',
      name: 'Masters',
      description: 'Apply for masters programs with your portfolio',
      icon: Briefcase,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    }
  ];

  const handleTypeSelect = (type: string) => {
    navigate(`/portfolio/create/template?type=${type}`);
  };

  const handleBack = () => {
    navigate('/portfolio');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Select Portfolio Type</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-4">
          {portfolioTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className="w-full bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200 hover:border-gray-300"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${type.color} ${type.hoverColor} rounded-xl flex items-center justify-center transition-colors`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {type.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {type.description}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Choose the type of portfolio you want to create
          </p>
          <p className="text-gray-400 text-xs mt-1">
            You can always change this later
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectPortfolioType;
