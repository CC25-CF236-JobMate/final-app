import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Upload, FileText, Sparkles, Zap, Target, CheckCircle, ArrowRight } from 'lucide-react';

const CvReviewPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex flex-col relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-20 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-32 w-36 h-36 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-32 left-1/3 w-32 h-32 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
                <div className="absolute bottom-20 right-20 w-28 h-28 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
            </div>

            <Navbar />

            <main className="flex-grow px-4 py-16 relative z-10">
                {/* Header Section */}
                <div className="max-w-6xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
                        <Target size={14} className="text-blue-600" />
                        <span>Analisis CV Berbasis ATS</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight mb-6">
                        Analisis CV dengan Teknologi ATS
                    </h1>
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200/50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
                        <Sparkles size={14} className="text-green-600" />
                        <span>Gratis & Instan!</span>
                    </div>
                    
                    <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
                        Optimalkan CV-mu agar terbaca oleh Applicant Tracking System (ATS) dan tingkatkan peluang suksesmu dalam melamar kerja dengan analisis mendalam dan saran perbaikan.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-12">
                    {/* Upload Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-blue-900/10 p-8 w-full max-w-lg mx-auto lg:mx-0 border border-gray-200/50">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Upload size={32} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload CV Anda</h2>
                            <p className="text-xs text-gray-500">
                                Unggah file dalam format PDF, DOCX atau DOC dengan ukuran maksimal 25 MB
                            </p>
                        </div>

                        {/* Drop Zone */}
                        <div className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors duration-300 p-8 rounded-2xl text-center mb-6 bg-gradient-to-br from-gray-50 to-blue-50/30 hover:from-blue-50 hover:to-purple-50/30 group cursor-pointer">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <FileText size={24} className="text-blue-600" />
                            </div>
                            <p className="text-sm text-gray-600 font-medium mb-2">
                                Seret file ke sini atau <span className="text-blue-600 font-semibold hover:underline">Browse</span>
                            </p>
                            <p className="text-xs text-gray-500">
                                Format: PDF, DOCX, DOC • Maksimal: 25 MB
                            </p>
                        </div>

                        {/* Upload Buttons */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button className="group bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:scale-105">
                                <img src="/google_drive.png" alt="Google Drive" className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                <span className="text-sm">Drive</span>
                            </button>
                            <button className="group bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:scale-105">
                                <img src="/browseicon.png" alt="Browse File" className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                <span className="text-sm">Browse</span>
                            </button>
                        </div>

                        <div className="text-xs text-gray-400 text-center mb-6 flex items-center justify-center gap-2">
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                            <span>Atau seret file langsung ke area di atas</span>
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm">
                                Batal
                            </button>
                            <a 
                                href="/resumeanalysis" 
                                className="flex-1 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center flex items-center justify-center gap-2"
                            >
                                <Zap size={18} />
                                <span>Analisis Sekarang!</span>
                            </a>
                        </div>
                    </div>

                    {/* Features & Illustration Section */}
                    <div className="w-full max-w-2xl mx-auto lg:mx-0">
                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                                    <CheckCircle size={24} className="text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Analisis ATS</h3>
                                <p className="text-sm text-gray-600">Periksa kompatibilitas CV dengan sistem ATS perusahaan</p>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                                    <Target size={24} className="text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Saran Perbaikan</h3>
                                <p className="text-sm text-gray-600">Dapatkan rekomendasi untuk meningkatkan kualitas CV</p>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                                    <Sparkles size={24} className="text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Gratis & Cepat</h3>
                                <p className="text-sm text-gray-600">Analisis instan tanpa biaya dan registrasi</p>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                                    <ArrowRight size={24} className="text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Hasil Detail</h3>
                                <p className="text-sm text-gray-600">Laporan komprehensif dengan skor dan analisis mendalam</p>
                            </div>
                        </div>

                        {/* Illustration */}
                        <div className="hidden lg:block bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50">
                            <img 
                                src="/cv-illustration.png" 
                                alt="CV Review Illustration" 
                                className="w-full rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="max-w-4xl mx-auto mt-20 text-center">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-blue-900/10 p-8 border border-gray-200/50">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                <Zap size={18} className="text-white" />
                            </div>
                            Mengapa Memilih Analisis CV Kami?
                        </h3>
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                            Dengan teknologi AI terdepan, kami menganalisis CV Anda seperti yang dilakukan oleh sistem ATS perusahaan. 
                            Dapatkan insight mendalam tentang kekuatan dan area yang perlu diperbaiki, lengkap dengan panduan 
                            step-by-step untuk optimasi maksimal.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CvReviewPage;