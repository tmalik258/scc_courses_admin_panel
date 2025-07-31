import React from 'react';

interface EntriesSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export const EntriesSelector: React.FC<EntriesSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-700">Show:</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
      <span className="text-sm text-gray-700">Entries</span>
    </div>
  );
};