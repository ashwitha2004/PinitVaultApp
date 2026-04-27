import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, RefreshCw, FolderOpen } from 'lucide-react';
import PortfolioCard from '../../components/portfolio/PortfolioCard';
import type { PortfolioHomeItem } from '../../types/Portfolio';

const PortfolioHome: React.FC = () => {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState<PortfolioHomeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  // Fetch portfolios from API
  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call - replace with actual API endpoint
      const response = await axios.get('/api/portfolios');
      setPortfolios(response.data);
    } catch (err) {
      console.error('Failed to fetch portfolios:', err);
      setError('Failed to load portfolios');
      
      // For demo purposes, load mock data if API fails
      const mockData: PortfolioHomeItem[] = [
        {
          id: '1',
          name: 'Personal Portfolio',
          type: 'Personal',
          status: 'Active'
        },
        {
          id: '2',
          name: 'Masters Application',
          type: 'Masters',
          status: 'Secured'
        }
      ];
      setPortfolios(mockData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  // Handle actions
  const handleEdit = (id: string) => {
    navigate(`/portfolio/edit/${id}`);
  };

  const handleShare = (id: string) => {
    navigate(`/portfolio/share/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      // Call DELETE API
      await axios.delete(`/api/portfolios/${id}`);
      
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
      <p className="text-gray-600 mb-6">Create your first portfolio to get started</p>
      <button
        onClick={handleCreate}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Create Portfolio
      </button>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {loading ? (
          // Loading skeleton state
          <div>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : error ? (
          // Error state
          <ErrorState />
        ) : portfolios.length === 0 ? (
          // Empty state
          <EmptyState />
        ) : (
          // Portfolio list
          <div>
            {portfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                onEdit={handleEdit}
                onShare={handleShare}
                onDelete={() => setShowDeleteModal(portfolio.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={handleCreate}
        className="fixed bottom-24 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal
          id={showDeleteModal}
          name={portfolios.find(p => p.id === showDeleteModal)?.name || ''}
        />
      )}
    </div>
  );
};

export default PortfolioHome;
