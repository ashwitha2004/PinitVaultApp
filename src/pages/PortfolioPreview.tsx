import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, Image, Video, User, BookOpen, Award, Code, Link, Edit, Download, Share2, Copy, Eye, EyeOff, Save, Plus, Briefcase, GraduationCap, Shield } from 'lucide-react';
import QRCode from 'qrcode';

interface VaultDocument {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'video';
  size: string;
  uploadDate: string;
  category: 'academic' | 'professional' | 'masters' | 'certifications' | 'personal';
  verified?: boolean;
}

interface PortfolioDraft {
  id: string;
  name: string;
  type: 'personal' | 'academic' | 'professional' | 'masters';
  template: string;
  documents: VaultDocument[];
  createdAt: string;
  status: 'draft' | 'published';
}

const PortfolioPreview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [portfolio, setPortfolio] = useState<PortfolioDraft | null>(null);
  const [portfolioName, setPortfolioName] = useState<string>('My Portfolio');
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [shareLink, setShareLink] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    try {
      const state = location.state as { portfolio?: PortfolioDraft };
      if (state?.portfolio) {
        setPortfolio(state.portfolio);
        setPortfolioName('My Portfolio');
      } else {
        // If no data, go back to portfolio builder
        navigate('/add-documents-from-vault');
      }
    } catch (err) {
      setError('Failed to load portfolio data');
      console.error('PortfolioPreview error:', err);
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (shareLink) {
      QRCode.toDataURL(shareLink, {
        width: 128,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
        .then(url => {
          setQrCodeUrl(url);
        })
        .catch(err => {
          console.error('Error generating QR code:', err);
        });
    }
  }, [shareLink]);

  // Auto-map documents to sections based on portfolio type
  const getPortfolioSections = () => {
    if (!portfolio) return {};

    const docs = portfolio.documents || [];
    
    switch (portfolio.type) {
      case 'professional':
        return {
          'Profile Summary': docs.filter(doc => 
            doc.name.toLowerCase().includes('resume') || 
            doc.name.toLowerCase().includes('profile')
          ),
          'Resume': docs.filter(doc => 
            doc.name.toLowerCase().includes('resume')
          ),
          'Education': docs.filter(doc => 
            doc.category === 'academic' && 
            (doc.name.toLowerCase().includes('degree') || 
             doc.name.toLowerCase().includes('certificate') ||
             doc.name.toLowerCase().includes('transcript'))
          ),
          'Key Projects': docs.filter(doc => 
            doc.name.toLowerCase().includes('project')
          ),
          'Internships': docs.filter(doc => 
            doc.name.toLowerCase().includes('internship')
          ),
          'Certifications': docs.filter(doc => 
            doc.category === 'certifications'
          ),
          'Achievements': docs.filter(doc => 
            doc.name.toLowerCase().includes('achievement') ||
            doc.name.toLowerCase().includes('award')
          )
        };
        
      case 'academic':
        return {
          'Student Profile': docs.filter(doc => 
            doc.name.toLowerCase().includes('profile') || 
            doc.name.toLowerCase().includes('student')
          ),
          'Education History': docs.filter(doc => 
            doc.category === 'academic' && 
            doc.name.toLowerCase().includes('degree')
          ),
          'Marksheets': docs.filter(doc => 
            doc.category === 'academic' && 
            doc.name.toLowerCase().includes('marksheet')
          ),
          'Degree Certificates': docs.filter(doc => 
            doc.category === 'academic' && 
            doc.name.toLowerCase().includes('certificate')
          ),
          'Entrance Exams': docs.filter(doc => 
            doc.name.toLowerCase().includes('gre') ||
            doc.name.toLowerCase().includes('ielts') ||
            doc.name.toLowerCase().includes('toefl') ||
            doc.name.toLowerCase().includes('sat')
          ),
          'Certifications': docs.filter(doc => 
            doc.category === 'certifications'
          )
        };
        
      case 'masters':
        return {
          'Student Profile': docs.filter(doc => 
            doc.name.toLowerCase().includes('profile') || 
            doc.name.toLowerCase().includes('student')
          ),
          'Education': docs.filter(doc => 
            doc.category === 'academic'
          ),
          'SOP': docs.filter(doc => 
            doc.name.toLowerCase().includes('sop') ||
            doc.name.toLowerCase().includes('statement')
          ),
          'LOR': docs.filter(doc => 
            doc.name.toLowerCase().includes('lor') ||
            doc.name.toLowerCase().includes('recommendation')
          ),
          'Entrance Exams': docs.filter(doc => 
            doc.name.toLowerCase().includes('gre') ||
            doc.name.toLowerCase().includes('ielts') ||
            doc.name.toLowerCase().includes('toefl')
          ),
          'Research / Experience': docs.filter(doc => 
            doc.name.toLowerCase().includes('research') ||
            doc.name.toLowerCase().includes('experience')
          ),
          'Financial Documents': docs.filter(doc => 
            doc.name.toLowerCase().includes('financial')
          )
        };
        
      case 'personal':
        return {
          'Identity Documents': docs.filter(doc => 
            doc.name.toLowerCase().includes('aadhaar') ||
            doc.name.toLowerCase().includes('pan')
          ),
          'Passport': docs.filter(doc => 
            doc.name.toLowerCase().includes('passport')
          ),
          'Licenses': docs.filter(doc => 
            doc.name.toLowerCase().includes('license')
          ),
          'Photos': docs.filter(doc => 
            doc.type === 'image'
          ),
          'Supporting Personal Records': docs.filter(doc => 
            !doc.name.toLowerCase().includes('passport') &&
            !doc.name.toLowerCase().includes('license') &&
            !doc.name.toLowerCase().includes('aadhaar') &&
            !doc.name.toLowerCase().includes('pan')
          )
        };
        
      default:
        return {};
    }
  };

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

  const getSectionIcon = (sectionName: string) => {
    const name = sectionName.toLowerCase();
    if (name.includes('profile') || name.includes('summary')) return User;
    if (name.includes('resume')) return FileText;
    if (name.includes('education') || name.includes('academic')) return BookOpen;
    if (name.includes('project')) return Code;
    if (name.includes('certification')) return Award;
    if (name.includes('internship')) return Briefcase;
    if (name.includes('achievement')) return GraduationCap;
    if (name.includes('identity') || name.includes('passport') || name.includes('license')) return Shield;
    if (name.includes('sop') || name.includes('statement')) return FileText;
    if (name.includes('lor') || name.includes('recommendation')) return FileText;
    if (name.includes('exam')) return FileText;
    if (name.includes('research') || name.includes('experience')) return Briefcase;
    if (name.includes('financial')) return FileText;
    if (name.includes('photo')) return Image;
    return FileText;
  };

  const getSectionColor = (sectionName: string) => {
    const name = sectionName.toLowerCase();
    if (name.includes('profile') || name.includes('summary')) return 'bg-blue-500';
    if (name.includes('resume')) return 'bg-blue-500';
    if (name.includes('education') || name.includes('academic')) return 'bg-purple-500';
    if (name.includes('project')) return 'bg-orange-500';
    if (name.includes('certification')) return 'bg-green-500';
    if (name.includes('internship')) return 'bg-blue-500';
    if (name.includes('achievement')) return 'bg-yellow-500';
    if (name.includes('identity') || name.includes('passport') || name.includes('license')) return 'bg-red-500';
    if (name.includes('sop') || name.includes('statement')) return 'bg-indigo-500';
    if (name.includes('lor') || name.includes('recommendation')) return 'bg-pink-500';
    if (name.includes('exam')) return 'bg-teal-500';
    if (name.includes('research') || name.includes('experience')) return 'bg-orange-500';
    if (name.includes('financial')) return 'bg-green-500';
    if (name.includes('photo')) return 'bg-green-500';
    return 'bg-gray-500';
  };

  const handleSaveDraft = () => {
    if (portfolio) {
      try {
        // Save portfolio draft to localStorage
        const existing = JSON.parse(localStorage.getItem("portfolioDrafts") || "[]");
        localStorage.setItem(
          "portfolioDrafts",
          JSON.stringify([{ ...portfolio, status: 'draft' }, ...existing])
        );
        alert('Portfolio draft saved successfully!');
      } catch (error) {
        console.error('Error saving draft:', error);
        alert('Error saving draft. Please try again.');
      }
    }
  };

  const handleEditDocuments = () => {
    if (portfolio) {
      navigate('/add-documents-from-vault', { 
        state: { 
          selectedType: portfolio.type, 
          selectedTemplate: portfolio.template 
        } 
      });
    }
  };

  const handleChangeTemplate = () => {
    if (portfolio) {
      navigate('/create-portfolio', { 
        state: { 
          selectedType: portfolio.type 
        } 
      });
    }
  };

  const handleShare = () => {
    if (portfolio) {
      const link = `https://pinit.app/portfolio/${portfolio.id}`;
      setShareLink(link);
      setShowQRCode(true);
    }
  };

  const handleDownload = () => {
    if (portfolio) {
      alert(`Downloading "${portfolio.name}" portfolio as PDF... This will include all selected documents and template layout.`);
    }
  };

  const handleView = () => {
    if (portfolio) {
      alert(`Opening "${portfolio.name}" portfolio in new tab with live preview...`);
      // In a real implementation, this would open the portfolio in a new tab
      // window.open(`/portfolio/${portfolio.id}`, '_blank');
    }
  };

  const handleBack = () => {
    navigate('/add-documents-from-vault');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Share link copied to clipboard!');
  };

  const sections = getPortfolioSections();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 bg-red-500 rounded-full"></div>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/add-documents-from-vault')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900">{portfolioName}</h1>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                portfolio.status === 'published' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {portfolio.status === 'published' ? 'Secured' : 'Draft'}
              </span>
            </div>
            <div className="w-9"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
            onClick={handleSaveDraft}
            className="flex flex-col items-center gap-1 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Save className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600">Save Draft</span>
          </button>
          <button
            onClick={handleEditDocuments}
            className="flex flex-col items-center gap-1 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Edit className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600">Edit Docs</span>
          </button>
          <button
            onClick={handleChangeTemplate}
            className="flex flex-col items-center gap-1 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600">Template</span>
          </button>
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600">Share</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex flex-col items-center gap-1 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600">Download</span>
          </button>
          <button
            onClick={handleView}
            className="flex flex-col items-center gap-1 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600">View</span>
          </button>
        </div>

        {/* Portfolio Preview */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
          {/* Profile Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  {portfolioName}
                </h3>
                <p className="text-gray-600 capitalize">
                  {portfolio.type} Portfolio
                </p>
                <p className="text-sm text-gray-500">
                  {portfolio.documents.length} documents • {portfolio.template}
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="p-6 space-y-4">
            {Object.entries(sections).map(([sectionName, sectionFiles]) => {
              const SectionIcon = getSectionIcon(sectionName);
              const sectionColor = getSectionColor(sectionName);
              const files = sectionFiles as VaultDocument[];
              
              return (
                <div key={sectionName} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 ${sectionColor} rounded-lg flex items-center justify-center`}>
                        <SectionIcon className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900">{sectionName}</h4>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {files.length}
                    </span>
                  </div>
                  
                  {/* Documents in Section */}
                  {files.length > 0 ? (
                    <div className="space-y-2">
                      {files.map((file) => {
                        const Icon = getFileIcon(file.type);
                        const fileColor = getFileColor(file.type);
                        
                        return (
                          <div key={file.id} className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 ${fileColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {file.name}
                                  </p>
                                  {file.verified && (
                                    <Shield className="w-3 h-3 text-blue-500 flex-shrink-0" />
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                  <span>{file.type.toUpperCase()}</span>
                                  <span>{file.size}</span>
                                  <span>{file.uploadDate}</span>
                                </div>
                              </div>
                              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Empty placeholder */
                    <div className="text-center py-4">
                      <Plus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 mb-2">No items in this section</p>
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        + Add item
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Generate Link Button */}
        <button
          onClick={handleShare}
          className="w-full py-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Link className="w-5 h-5" />
          Generate Share Link
        </button>
      </div>

      {/* QR Code Modal */}
      {showQRCode && shareLink && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Share Your Portfolio</h2>
              <button
                onClick={() => setShowQRCode(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <EyeOff className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            <div className="bg-gray-100 rounded-xl p-6 mb-4">
              <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                {/* QR Code */}
                <div className="bg-white p-4 rounded-lg">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                    {qrCodeUrl ? (
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-400 text-sm">Generating QR...</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Share Link</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPreview;
