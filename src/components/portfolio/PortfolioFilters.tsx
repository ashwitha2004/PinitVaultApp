import React from 'react';

interface Props {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const PortfolioFilters: React.FC<Props> = ({ activeFilter, onFilterChange }) => {
  const filters = ['All', 'Active', 'Shared', 'Draft'];

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === filter
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default PortfolioFilters;
