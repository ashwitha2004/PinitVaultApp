import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, FileText, Image, Video, BookOpen, Briefcase, Award } from 'lucide-react';
import { loadVaultDocuments, type VaultDocument } from '../utils/portfolioBuilder';

const SelectDocuments: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [files, setFiles] = useState<VaultDocument[]>([]);

  useEffect(() => {
    // Load documents from vaultDocuments localStorage
    try {
      const vaultDocs = loadVaultDocuments();
      setFiles(vaultDocs);
    } catch (error) {
      console.error('Error loading vault documents:', error);
      setFiles([]);
    }
  }, []);

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

  const getGroupedFiles = () => {
    const groups: { [key: string]: VaultDocument[] } = {
      Academic: [],
      Professional: [],
      Projects: [],
      Certifications: []
    };

    files.forEach(file => {
      switch (file.category) {
        case 'academic':
          groups.Academic.push(file);
          break;
        case 'resume':
          groups.Professional.push(file);
          break;
        case 'project':
          groups.Projects.push(file);
          break;
        case 'certification':
          groups.Certifications.push(file);
          break;
      }
    });

    return groups;
  };

  const getGroupIcon = (group: string) => {
    switch (group) {
      case 'Academic':
        return BookOpen;
      case 'Professional':
        return Briefcase;
      case 'Projects':
        return FileText;
      case 'Certifications':
        return Award;
      default:
        return FileText;
    }
  };

  const getGroupColor = (group: string) => {
    switch (group) {
      case 'Academic':
        return 'bg-purple-500';
      case 'Professional':
        return 'bg-blue-500';
      case 'Projects':
        return 'bg-orange-500';
      case 'Certifications':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const toggleSelection = (fileId: string) => {
    setSelectedDocs(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleNext = () => {
    if (selectedDocs.length > 0) {
      navigate('/choose-template', { state: { selectedDocs } });
    }
  };

  const handleBack = () => {
    navigate('/portfolio');
  };

  const groupedFiles = getGroupedFiles();
  const selectedFiles = files.filter(file => selectedDocs.includes(file.id));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Select Documents</h1>
            <div className="w-9"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Selected Count */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Select documents</h2>
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {selectedDocs.length} selected
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-1">Choose documents to include in your portfolio</p>
        </div>

        {/* Document Groups */}
        <div className="space-y-6 mb-8">
          {Object.entries(groupedFiles).map(([groupName, groupFiles]) => {
            if (groupFiles.length === 0) return null;
            
            const GroupIcon = getGroupIcon(groupName);
            const groupColor = getGroupColor(groupName);
            
            return (
              <div key={groupName}>
                {/* Group Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 ${groupColor} rounded-lg flex items-center justify-center`}>
                    <GroupIcon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{groupName}</h3>
                  <span className="text-sm text-gray-500">({groupFiles.length})</span>
                </div>

                {/* Files in Group */}
                <div className="space-y-2">
                  {groupFiles.map((file) => {
                    const Icon = getFileIcon(file.type);
                    const fileColor = getFileColor(file.type);
                    const isSelected = selectedDocs.includes(file.id);
                    
                    return (
                      <button
                        key={file.id}
                        onClick={() => toggleSelection(file.id)}
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
                            <Icon className="w-5 h-5 text-white" />
                          </div>

                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {file.type}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Files Summary */}
        {selectedFiles.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-medium text-blue-900 mb-2">
              {selectedFiles.length} documents selected
            </p>
            <div className="space-y-1">
              {selectedFiles.slice(0, 3).map((file) => (
                <p key={file.id} className="text-xs text-blue-700 truncate">
                  {file.name}
                </p>
              ))}
              {selectedFiles.length > 3 && (
                <p className="text-xs text-blue-700">
                  +{selectedFiles.length - 3} more documents
                </p>
              )}
            </div>
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={selectedDocs.length === 0}
          className={`w-full py-4 rounded-xl font-medium transition-colors ${
            selectedDocs.length > 0
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next {selectedDocs.length > 0 && `(${selectedDocs.length})`}
        </button>
      </div>
    </div>
  );
};

export default SelectDocuments;
