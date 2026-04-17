import React from 'react';
import { Eye, FileText, Share2, TrendingUp } from 'lucide-react';
import type { PortfolioType } from '../../types';

interface Props {
  portfolio: PortfolioType;
  onView: () => void;
  onTrack: () => void;
  onShare: () => void;
}

const PortfolioCard: React.FC<Props> = ({ portfolio, onView, onTrack, onShare }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/10';
      case 'shared':
        return 'text-blue-400 bg-blue-400/10';
      case 'draft':
        return 'text-gray-400 bg-gray-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'placement':
        return 'text-purple-400';
      case 'masters':
        return 'text-blue-400';
      case 'professional':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 text-sm font-medium truncate">{portfolio.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(portfolio.status)}`}>
            {portfolio.status.charAt(0).toUpperCase() + portfolio.status.slice(1)}
          </span>
        </div>
        <span className={`text-xs ${getTypeColor(portfolio.type)}`}>
          {portfolio.type.charAt(0).toUpperCase() + portfolio.type.slice(1)}
        </span>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-1">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 text-sm">{portfolio.documents}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 text-sm">{portfolio.views}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onView}
          className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
        >
          View
        </button>
        <button
          onClick={onTrack}
          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
        >
          <TrendingUp className="w-3 h-3" />
          Track
        </button>
        <button
          onClick={onShare}
          className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PortfolioCard;
