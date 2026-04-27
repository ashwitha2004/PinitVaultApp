import React from 'react';
import { Edit, Share2, Trash2 } from 'lucide-react';

interface Props {
  onEdit: () => void;
  onShare: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const PortfolioMenu: React.FC<Props> = ({ onEdit, onShare, onDelete, onClose }) => {
  return (
    <div className="absolute right-0 top-8 z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[140px]">
      <button
        onClick={() => {
          onEdit();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
      >
        <Edit className="w-4 h-4" />
        Edit
      </button>
      <button
        onClick={() => {
          onShare();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </div>
  );
};

export default PortfolioMenu;
