// src/components/JobSearchComp/PaginationJobs.tsx
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalJobs: number;
    jobsPerPage: number;
    onPageChange: (page: number) => void;
}

const PaginationJobs: React.FC<PaginationProps> = ({ currentPage, totalJobs, jobsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalJobs / jobsPerPage);
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        const halfPages = Math.floor(maxPagesToShow / 2);

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > halfPages + 1) pages.push('...');
            let startPage = Math.max(2, currentPage - halfPages + 1);
            let endPage = Math.min(totalPages - 1, currentPage + halfPages -1);
            if (currentPage <= halfPages) endPage = Math.min(totalPages - 1, maxPagesToShow - 1);
            if (currentPage > totalPages - halfPages) startPage = Math.max(2, totalPages - maxPagesToShow + 2);
            for (let i = startPage; i <= endPage; i++) pages.push(i);
            if (currentPage < totalPages - halfPages) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };
    
    const pageNumbers = getPageNumbers();

    return (
        <nav className="flex justify-center mt-12" aria-label="Pagination">
            <ul className="flex items-center -space-x-px h-10 text-base">
                <li>
                    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span className="sr-only">Previous</span>
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4"/></svg>
                    </button>
                </li>
                
                <div className="hidden sm:flex">
                    {pageNumbers.map((page, index) => (
                        <li key={`${page}-${index}`}>
                             {page === '...' ? (
                                <span className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300">...</span>
                             ) : (
                                <button onClick={() => onPageChange(page as number)} className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 ${currentPage === page ? 'text-blue-600 bg-blue-50 font-bold' : 'text-gray-500 bg-white hover:bg-gray-100'}`}>
                                    {page}
                                </button>
                             )}
                        </li>
                    ))}
                </div>

                <li className="sm:hidden">
                     <span className="flex items-center justify-center px-4 h-10 leading-tight text-blue-600 bg-blue-50 font-bold border border-gray-300">
                        {currentPage} <span className="text-gray-500 font-normal mx-1">/</span> {totalPages}
                     </span>
                </li>
                
                <li>
                    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                         <span className="sr-only">Next</span>
                         <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1M13 5l-4 4"/></svg>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default PaginationJobs;
