// src/components/CompaniesComp/PaginationCompany.tsx
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PaginationCompany: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    
    // Logic to show a limited number of page buttons
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
    
    if (totalPages <= 1) return null;

    return (
        <nav className="flex justify-center mt-12">
            <ul className="flex items-center -space-x-px h-10 text-base">
                <li>
                    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        Sebelumnya
                    </button>
                </li>
                
                {startPage > 1 && (
                    <>
                        <li><button onClick={() => onPageChange(1)} className="flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 text-gray-500 bg-white hover:bg-gray-100">1</button></li>
                        {startPage > 2 && <li><span className="flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 text-gray-500 bg-white">...</span></li>}
                    </>
                )}

                {pageNumbers.map(number => (
                    <li key={number}>
                        <button onClick={() => onPageChange(number)} className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 ${currentPage === number ? 'text-blue-600 bg-blue-50 font-bold' : 'text-gray-500 bg-white hover:bg-gray-100'}`}>
                            {number}
                        </button>
                    </li>
                ))}

                {endPage < totalPages && (
                     <>
                        {endPage < totalPages - 1 && <li><span className="flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 text-gray-500 bg-white">...</span></li>}
                        <li><button onClick={() => onPageChange(totalPages)} className="flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 text-gray-500 bg-white hover:bg-gray-100">{totalPages}</button></li>
                    </>
                )}
                
                <li>
                    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        Berikutnya
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default PaginationCompany;
