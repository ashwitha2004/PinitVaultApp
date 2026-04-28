import React from 'react';
import PortfolioMenu from './PortfolioMenu';

interface Portfolio {
  id: string;
  name: string;
  type: "placement" | "masters" | "professional";
  status: "active" | "shared" | "draft";
}

interface Props {
  portfolio: Portfolio;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onShare: (id: string) => void;
  onDelete: (id: string) => void;
}

const PortfolioCard: React.FC<Props> = ({ portfolio, onView, onEdit, onShare, onDelete }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'shared':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'placement':
        return 'bg-purple-100 text-purple-800';
      case 'masters':
        return 'bg-indigo-100 text-indigo-800';
      case 'professional':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-3 relative">
      {/* Top Row */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-900 truncate flex-1">{portfolio.name}</h3>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          
          {showMenu && (
            <PortfolioMenu
              onView={() => onView(portfolio.id)}
              onEdit={() => onEdit(portfolio.id)}
              onShare={() => onShare(portfolio.id)}
              onDelete={() => onDelete(portfolio.id)}
              onClose={() => setShowMenu(false)}
            />
          )}
        </div>
      </div>

      {/* Second Row */}
      <div className="flex gap-2">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(portfolio.type)}`}>
          {portfolio.type}
        </span>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(portfolio.status)}`}>
          {portfolio.status}
        </span>
      </div>
    </div>
  );
};

export default PortfolioCard;
