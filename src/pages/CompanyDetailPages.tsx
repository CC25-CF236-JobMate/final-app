// src/pages/CompanyDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CompanyDetail from '../components/CompaniesComp/CompanyDetail';
import { fetchCompanyById, type Company } from '../services/CompanyService';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

const CompanyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [company, setCompany] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const loadCompanyDetail = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const data = await fetchCompanyById(id);
                    setCompany(data);
                } catch (err: any) {
                    setError(err.message || 'Gagal memuat detail perusahaan.');
                } finally {
                    setIsLoading(false);
                }
            };
            loadCompanyDetail();
        } else {
            setError("ID Perusahaan tidak ditemukan.");
            setIsLoading(false);
        }
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <Link to="/companies" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors group">
                            <ArrowLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Daftar Perusahaan
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-md">
                            <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-600 bg-red-50 p-6 rounded-xl shadow-md flex items-center justify-center gap-2">
                            <AlertCircle /> {error}
                        </div>
                    ) : company ? (
                        <CompanyDetail company={company} />
                    ) : (
                        <div className="text-center text-gray-500 py-16">
                            <p>Data perusahaan tidak ditemukan.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CompanyDetailPage;
