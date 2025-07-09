import { EntriesSelector } from '@/components/entries-selector';
import { SearchBar } from '@/components/searchbar';
import React from 'react';

interface StudentsHeaderProps {
  totalStudents: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  entriesPerPage: number;
  onEntriesChange: (value: number) => void;
}

export const StudentsHeader: React.FC<StudentsHeaderProps> = ({
  totalStudents,
  searchValue,
  onSearchChange,
  entriesPerPage,
  onEntriesChange
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            All Student ({totalStudents.toLocaleString()})
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <SearchBar
            placeholder="Search"
            value={searchValue}
            onChange={onSearchChange}
          />
          <EntriesSelector
            value={entriesPerPage}
            onChange={onEntriesChange}
          />
        </div>
      </div>
    </div>
  );
};
