// src/components/PaginationJobs.tsx
import React from 'react';

interface PaginationJobsProps {
  totalJobs: number;
  jobsPerPage: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}

const PaginationJobs: React.FC<PaginationJobsProps> = ({
  totalJobs,
  jobsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) {
    return null; // Jangan tampilkan pagination jika hanya ada 1 halaman atau kurang
  }

  return (
    <nav aria-label="Pagination" className="flex justify-center items-center space-x-2 mt-12 mb-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors
                    ${currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
      >
        Sebelumnya
      </button>

      {/* Tampilkan maksimal 5 nomor halaman sekaligus dengan elipsis jika terlalu banyak */}
      {/* Logika ini bisa dibuat lebih canggih, untuk saat ini kita tampilkan semua */}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors
                        ${currentPage === number 
                            ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors
                    ${currentPage === totalPages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
      >
        Berikutnya
      </button>
    </nav>
  );
};

export default PaginationJobs;