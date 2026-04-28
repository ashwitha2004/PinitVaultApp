import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PortfolioCard from '../../components/portfolio/PortfolioCard';
import { Plus, FolderOpen, RefreshCw } from 'lucide-react';
import { getAllPortfolios, deletePortfolio } from '../../services/portfolioService';

interface Portfolio {
  id: string;
  name: string;
  type: "Personal" | "Masters" | "Academic" | "Professional";
  status: "Active" | "Secured" | "Draft";
}

export default function PortfolioHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const USE_MOCK = false;

  const fetchPortfolios = async () => {
    try {
      console.log('=== LISTING DEBUG: Starting portfolio fetch ===');
      setLoading(true);
      setError(null);

      const res = await getAllPortfolios();
      console.log('FETCHED:', res.data);
      setPortfolios(res.data || []);
      console.log('LISTING DEBUG: Portfolios state updated');
    } catch (err) {
      console.error('FETCH ERROR:', err);
      setPortfolios([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('LISTING DEBUG: useEffect triggered, refresh state:', location.state?.refresh);
    
    if (USE_MOCK) {
      setPortfolios([
        {
          id: "1",
          name: "My Portfolio",
          type: "Personal",
          status: "Active"
        }
      ]);
      setLoading(false);
      return;
    }

    fetchPortfolios();
  }, [location.state?.refresh]); // Trigger on refresh state from navigation

  const handleView = (id: string) => {
    navigate(`/portfolio/view/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/portfolio/edit/${id}`);
  };

  const handleShare = (id: string) => {
    navigate(`/portfolio/share/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deletePortfolio(id);
      console.log('DELETE RESPONSE:', res);
      
      // Remove from UI state
      setPortfolios(prev => prev.filter(p => p.id !== id));
      setShowDeleteModal(null);
    } catch (err) {
      console.error('Failed to delete portfolio:', err);
      setError('Failed to delete portfolio');
    }
  };

  const handleCreate = () => {
    navigate('/portfolio/create');
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-3">
      <div className="flex justify-between items-start mb-3">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-5 bg-gray-200 rounded-full w-20 animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded-full w-16 animate-pulse"></div>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FolderOpen className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No portfolios yet</h3>
      <p className="text-gray-600 mb-6">Create your first portfolio</p>
      <div className="absolute bottom-[90px] right-5 z-50">
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <RefreshCw className="w-12 h-12 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load portfolios</h3>
      <p className="text-gray-600 mb-6">Something went wrong. Please try again.</p>
      <button
        onClick={fetchPortfolios}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <RefreshCw className="w-5 h-5" />
        Retry
      </button>
    </div>
  );

  // Delete confirmation modal
  const DeleteModal = ({ id, name }: { id: string; name: string }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Portfolio</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{name}"? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteModal(null)}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(id)}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  // IF loading:
  if (loading) {
    return (
      <div className="page">
        <div className="page-content">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 mb-4">
            <div className="px-4 py-4">
              <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
            </div>
          </div>

          {/* Content */}
          <div>
            <div>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // IF error:
  if (error) {
    return (
      <div className="page">
        <div className="page-content">
          <ErrorState />
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
            <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
          </div>
        </div>

        {/* Content */}
        <div>
          {(() => {
            console.log('RENDER DEBUG: portfolios state before render:', portfolios);
            console.log('RENDER DEBUG: portfolios.length:', portfolios.length);
            return null;
          })()}
          {portfolios.length === 0 ? (
            <EmptyState />
          ) : (
            <div>
              {portfolios.map((portfolio) => (
                <PortfolioCard
                  key={portfolio.id}
                  portfolio={portfolio}
                  onView={() => handleView(portfolio.id)}
                  onEdit={() => handleEdit(portfolio.id)}
                  onShare={() => handleShare(portfolio.id)}
                  onDelete={() => setShowDeleteModal(portfolio.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <div className="absolute bottom-[90px] right-5 z-50">
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Portfolio</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{portfolios.find(p => p.id === showDeleteModal)?.name || ''}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
