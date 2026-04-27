import React from 'react';
import { MoreVertical } from 'lucide-react';
import type { PortfolioHomeItem } from '../../types/Portfolio';
import PortfolioMenu from './PortfolioMenu';

interface Props {
  portfolio: PortfolioHomeItem;
  onEdit: (id: string) => void;
  onShare: (id: string) => void;
  onDelete: (id: string) => void;
}

const PortfolioCard: React.FC<Props> = ({ portfolio, onEdit, onShare, onDelete }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Secured':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Personal':
        return 'bg-purple-100 text-purple-800';
      case 'Masters':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-3">
      {/* Top Row */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-900">{portfolio.name}</h3>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          
          {showMenu && (
            <PortfolioMenu
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
