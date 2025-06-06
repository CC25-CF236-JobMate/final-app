// src/components/JobSearchStatus.tsx
import React, { useState } from 'react';
import { Search, Briefcase, XCircle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { updateProfile } from '../services/ProfileService';
import Swal from 'sweetalert2';

type StatusOption = 'aktif' | 'terbuka' | 'tidak';

const statusMapping: Record<StatusOption, string> = {
    'aktif': 'Aktif Mencari Pekerjaan',
    'terbuka': 'Selalu Terbuka untuk Oportunitas',
    'tidak': 'Tidak Terbuka'
};

const JobSearchStatus: React.FC = () => {
    const currentStep = 5;
    const navigate = useNavigate();
    const [selected, setSelected] = useState<StatusOption>('aktif');
    const [isLoading, setIsLoading] = useState(false);

    const handleFinish = async () => {
        setIsLoading(true);
        try {
            const statusToSave = statusMapping[selected];
            await updateProfile({ status: statusToSave });

            Swal.fire({
                title: 'Profil Lengkap!',
                text: 'Selamat, profil Anda sudah siap. Mari mulai mencari pekerjaan!',
                icon: 'success',
                confirmButtonText: 'Mulai Sekarang!',
                customClass: { popup: 'rounded-xl' }
            }).then(() => {
                navigate('/'); // Arahkan ke dashboard
            });

        } catch (err: any) {
            Swal.fire("Error", err.message || "Gagal menyimpan status pekerjaan.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="w-full md:w-1/2 bg-white px-6 md:px-16 py-10 flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/jobpreferfill"><ArrowLeft className="w-5 h-5 text-gray-500 cursor-pointer" /></Link>
                    <div className="flex gap-2 flex-1 justify-center">
                        {[...Array(5)].map((_, index) => <div key={index} className={`h-2 w-8 rounded-full ${index < currentStep ? 'bg-yellow-400' : 'bg-gray-200'}`} />)}
                    </div>
                </div>
                <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 flex-grow flex flex-col justify-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Apakah kamu sedang mencari peluang baru?</h2>
                        <p className="text-sm text-gray-600 mb-6">Pilih salah satu opsi untuk menentukan status pencarian kerja kamu.</p>
                        <div className="space-y-3">
                            <button onClick={() => setSelected('aktif')} className={`w-full flex items-start gap-3 text-left px-4 py-3 rounded-lg border transition ${selected === 'aktif' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-200'}`}>
                                <Search className="w-5 h-5 mt-1" />
                                <div><p className="font-medium">Ya, sedang aktif mencari</p><p className="text-xs">Dapatkan undangan pekerjaan eksklusif</p></div>
                            </button>
                            <button onClick={() => setSelected('terbuka')} className={`w-full flex items-start gap-3 text-left px-4 py-3 rounded-lg border transition ${selected === 'terbuka' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-200'}`}>
                                <Briefcase className="w-5 h-5 mt-1" />
                                <div><p className="font-medium">Saya, terbuka</p><p className="text-xs">Pilih opsi ini untuk sesekali menerima undangan kerja</p></div>
                            </button>
                            <button onClick={() => setSelected('tidak')} className={`w-full flex items-start gap-3 text-left px-4 py-3 rounded-lg border transition ${selected === 'tidak' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-200'}`}>
                                <XCircle className="w-5 h-5 mt-1" />
                                <div><p className="font-medium">Tidak terbuka</p><p className="text-xs">Kamu dapat mengubah ini nanti ketika kamu membutuhkan pekerjaan</p></div>
                            </button>
                        </div>
                        <button onClick={handleFinish} disabled={isLoading} className="mt-8 w-full bg-blue-900 text-white py-2 rounded-lg text-center font-semibold hover:bg-blue-800 transition disabled:opacity-70">
                            {isLoading ? 'Menyimpan...' : 'Selesai'}
                        </button>
                    </div>
                </div>
            </div>
            <div className="hidden md:flex w-1/2 bg-yellow-400 items-center justify-center">
                <img src="/jobsearchstatus-illustration.png" alt="Illustration" className="max-w-[70%]" onError={(e) => {(e.target as HTMLImageElement).src='https://placehold.co/600x400/FFC107/FFFFFF?text=Ilustrasi'}}/>
            </div>
        </div>
    );
};

export default JobSearchStatus;
