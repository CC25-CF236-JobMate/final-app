// src/pages/JobDetailPage.tsx
import React from 'react';
import Navbar from '../components/Navbar'; // Sesuaikan path jika Navbar ada di ../components/
import Footer from '../components/Footer'; // Sesuaikan path jika Footer ada di ../components/
import JobDetail from "../components/JobDetailComp/JobDetail"; // Mengimpor komponen JobDetail

const JobDetailPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-blue-50 flex flex-col">
            <Navbar  /> {/* Sesuaikan prop jika perlu */}
            <main className="flex-grow">
                <JobDetail />
            </main>
            <Footer />
        </div>
    );
};

export default JobDetailPage;