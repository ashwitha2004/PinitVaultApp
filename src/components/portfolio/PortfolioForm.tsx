import React, { useState } from 'react';
import type { PortfolioType } from '../../types';

interface Props {
  onSubmit: (portfolio: Omit<PortfolioType, 'id' | 'documents' | 'views' | 'createdAt'>) => void;
  onCancel: () => void;
}

const PortfolioForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'placement' | 'masters' | 'professional'>('placement');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        type,
        status: 'draft'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Portfolio Name */}
      <div>
        <label className="block text-white text-sm font-medium mb-2">
          Portfolio Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter portfolio name"
          className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      {/* Portfolio Type */}
      <div>
        <label className="block text-white text-sm font-medium mb-2">
          Portfolio Type
        </label>
        <div className="space-y-3">
          {[
            { value: 'placement', label: 'Placement Portfolio', description: 'For job applications and placements' },
            { value: 'masters', label: 'Masters Portfolio', description: 'For higher education applications' },
            { value: 'professional', label: 'Professional Portfolio', description: 'For career development and networking' }
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                type === option.value
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <input
                type="radio"
                name="type"
                value={option.value}
                checked={type === option.value}
                onChange={(e) => setType(e.target.value as 'placement' | 'masters' | 'professional')}
                className="mt-1 text-purple-500 focus:ring-purple-500"
              />
              <div>
                <div className="text-white font-medium">{option.label}</div>
                <div className="text-gray-400 text-sm">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default PortfolioForm;
