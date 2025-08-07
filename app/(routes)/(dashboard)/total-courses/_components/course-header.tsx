"use client";

import { EntriesSelector } from "@/components/entries-selector";
import { SearchBar } from "@/components/searchbar";
import type React from "react";

interface CoursesHeaderProps {
  totalCourses: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  entriesPerPage: number;
  onEntriesChange: (value: number) => void;
}

export const CoursesHeader: React.FC<CoursesHeaderProps> = ({
  totalCourses,
  searchValue,
  onSearchChange,
  entriesPerPage,
  onEntriesChange,
}) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            All Course ({(totalCourses ?? 0).toLocaleString()})
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <SearchBar
            placeholder="Search"
            value={searchValue}
            onChange={onSearchChange}
          />
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">
              Show
            </span>
            <EntriesSelector
              value={entriesPerPage}
              onChange={onEntriesChange}
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">
              Entries
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
