import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CvReviewPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-blue-50 flex flex-col">
            <Navbar isLoggedIn={false} />

            <main className="flex-grow px-4 py-16">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                        Analisis CV dengan Teknologi ATS – Gratis & Instan!
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base mb-12">
                        Optimalkan CV-mu agar terbaca oleh Applicant Tracking System (ATS) dan tingkatkan peluang suksesmu dalam melamar kerja.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
                    {/* Upload Card */}
                    <div className="bg-white rounded-xl shadow-xl p-5 w-full max-w-lg mx-auto lg:mx-0">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Upload CV</h2>
                        <p className="text-xs text-gray-500 mb-4 text-center">
                            Please upload files in pdf, docx or doc format and make sure the file size is under 25 MB.
                        </p>
                        <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center text-sm text-gray-500 mb-4">
                            <img src="/clipboard.png" alt="Clipboard Icon" className="mx-auto mb-4 w-10 h-10" />
                            Drop file or <span className="text-blue-600 font-medium">Browse</span><br />
                            <span className="text-xs block mt-1">Format: pdf, docx, doc & Max file size: 25 MB</span>
                        </div>
                        {/* Buttons */}
                        <div className="flex gap-4 mb-4">
                            <button className="w-full bg-white border hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-lg flex items-center justify-center gap-x-2">
                                <img src="/google_drive.png" alt="Google Drive" className="w-5 h-5" />
                                Upload from Drive
                            </button>
                            <button className="w-full bg-white border hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-lg flex items-center justify-center gap-x-2">
                                <img src="/browseicon.png" alt="Browse File" className="w-5 h-5" />
                                Browse
                            </button>
                        </div>

                        <div className="text-xs text-gray-400 text-center mb-4">
                            Or Drop files in the drop zone above.
                        </div>

                        <div className="flex gap-2">
                            <button className="w-full bg-white border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50">
                                Cancel
                            </button>
                            <a href="/resumeanalysis" className="w-full bg-blue-900 text-white py-2 rounded-lg text-sm hover:bg-blue-800 text-center">
                                Review!
                            </a>
                        </div>
                    </div>

                    {/* Illustration */}
                    <div className="hidden lg:block w-full max-w-lg">
                        <img src="/cv-illustration.png" alt="CV Review Illustration" className="w-full" />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CvReviewPage;
