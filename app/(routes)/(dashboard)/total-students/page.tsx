"use client"

import React, { useState } from 'react';
import { Student } from '@/types/student';
import { Breadcrumb } from '@/components/breadcrumb';
import { StudentsHeader } from './_components/student-header';
import { StudentTable } from './_components/student-table';
import { Pagination } from '@/components/pagination';

const StudentsPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data - in real app, this would come from API
  const allStudents: Student[] = [
    {
      id: 'STD2025001',
      name: 'Emma Walker',
      phone: '+447911123456',
      email: 'emma.walker@email.com'
    },
    {
      id: 'STD2025002',
      name: 'Liam Rodriguez',
      phone: '+525512345678',
      email: 'liam.rodriguez@email.com'
    },
    {
      id: 'STD2025003',
      name: 'Sophie Muller',
      phone: '+4915123456789',
      email: 'sophie.muller@email.com'
    },
    {
      id: 'STD2025004',
      name: 'Akira Tanaka',
      phone: '+819012345678',
      email: 'akira.tanaka@email.com'
    },
    {
      id: 'STD2025005',
      name: 'Isabella Rossi',
      phone: '+33612345678',
      email: 'isabella.rossi@email.com'
    },
    {
      id: 'STD2025006',
      name: 'Carlos Mendes',
      phone: '+821012345678',
      email: 'carlos.mendes@email.com'
    },
    {
      id: 'STD2025007',
      name: 'Amelia Johnson',
      phone: '+201001234567',
      email: 'amelia.johnson@email.com'
    },
    {
      id: 'STD2025008',
      name: 'Yuna Kim',
      phone: '+791234567890',
      email: 'yuna.kim@email.com'
    }
  ];

  // Filter students based on search
  const filteredStudents = allStudents.filter(
    student =>
      student.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      student.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      student.id.toLowerCase().includes(searchValue.toLowerCase()) ||
      student.phone.includes(searchValue)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const handleEdit = (student: Student) => {
    console.log('Edit student:', student);
    // In real app, this would open edit modal or navigate to edit page
  };

  const handleDelete = (studentId: string) => {
    console.log('Delete student:', studentId);
    // In real app, this would show confirmation dialog and delete student
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Total Students', active: true }
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      
      <StudentsHeader
        totalStudents={1041}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        entriesPerPage={entriesPerPage}
        onEntriesChange={setEntriesPerPage}
      />

      <StudentTable
        students={currentStudents}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default StudentsPage;
