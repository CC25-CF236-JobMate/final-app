// src/components/ExperienceComp/PengalamanFill.tsx
import React, { useState } from 'react';
import { CalendarDays, Briefcase, Building, ArrowLeft, ClipboardList } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { addExperience, type ExperienceData, validEmploymentTypes } from '../services/ExperienceService';

const PengalamanFill: React.FC = () => {
    const currentStep = 2;
    const navigate = useNavigate();

    // State management for form inputs
    const [position, setPosition] = useState('');
    const [company, setCompany] = useState('');
    const [employmentType, setEmploymentType] = useState(validEmploymentTypes[0]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!position || !company || !employmentType || !startDate) {
            Swal.fire('Data Tidak Lengkap', 'Mohon isi Posisi, Perusahaan, Jenis Pekerjaan, dan Tanggal Mulai.', 'warning');
            return;
        }

        setIsLoading(true);

        try {
            const experienceData: Omit<ExperienceData, 'id' | 'createdAt' | 'updatedAt'> = {
                position,
                company,
                employmentType,
                description,
                startDate,
                endDate: endDate || null
            };
            
            await addExperience(experienceData);

            // Navigate to the next step on success
            navigate('/skillfill');

        } catch (err: any) {
            console.error("Failed to add experience:", err);
            Swal.fire('Error', err.message || 'Gagal menyimpan data pengalaman.', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSkip = () => {
        // Cukup arahkan ke halaman berikutnya tanpa menyimpan
        navigate('/skillfill');
    };

    return (
        <div className="min-h-screen flex">
            <div className="w-full md:w-1/2 px-6 md:px-16 py-10 bg-white">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/pendidikanfill"><ArrowLeft className="w-5 h-5 text-gray-500 cursor-pointer" /></Link>
                    <div className="flex gap-2 flex-1 justify-center">
                        {[...Array(5)].map((_, index) => <div key={index} className={`h-2 w-8 rounded-full ${index < currentStep ? 'bg-yellow-400' : 'bg-gray-200'}`} />)}
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Pengalaman Kerja</h2>
                <p className="text-sm text-gray-600 mb-8">Isilah pengalaman kerja Anda. Anda juga bisa melewatinya untuk saat ini.</p>
                
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Posisi</label>
                        <div className="relative"><input type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Masukkan posisi pekerjaan" required className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300" /><Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" /></div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan</label>
                        <div className="relative"><input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Masukkan nama perusahaan" required className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300" /><Building className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" /></div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Pekerjaan</label>
                        <div className="relative"><select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 appearance-none"><option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="freelance">Freelance</option><option value="internship">Internship</option><option value="contract">Contract</option></select><ClipboardList className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" /></div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/2"><label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label><div className="relative"><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300" /><CalendarDays className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" /></div></div>
                        <div className="w-1/2"><label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label><div className="relative"><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300" /><CalendarDays className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" /></div></div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Pekerjaan</label>
                        <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tuliskan deskripsi pekerjaan Anda" className="w-full px-4 py-2 rounded-lg border border-gray-300" />
                    </div>
                    <div className="pt-4 space-y-3">
                        <button type="submit" disabled={isLoading} className="w-full text-center bg-blue-900 text-white py-2.5 rounded-lg hover:bg-blue-800 font-semibold transition disabled:opacity-70">
                            {isLoading ? 'Menyimpan...' : 'Berikutnya'}
                        </button>
                        <button type="button" onClick={handleSkip} className="block w-full text-center bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 font-semibold transition">
                            Lewati Langkah Ini
                        </button>
                    </div>
                </form>
            </div>
            <div className="hidden md:flex w-1/2 bg-yellow-400 items-center justify-center">
                <img src="/experienceform-illustration.png" alt="Illustration" className="max-w-[70%]" onError={(e) => {(e.target as HTMLImageElement).src='https://placehold.co/600x400/FFC107/FFFFFF?text=Ilustrasi'}}/>
            </div>
        </div>
    );
};

export default PengalamanFill;
