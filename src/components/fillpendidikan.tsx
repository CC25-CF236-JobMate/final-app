// src/components/EducationComp/fillpendidikan.tsx
import React, { useState } from 'react';
import { GraduationCap, BookOpenText, CalendarCheck, ArrowLeft, Building } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { addEducation, type EducationData } from '../services/EducationService'; // Impor service pendidikan

const FillPendidikan: React.FC = () => {
    const currentStep = 1;
    const navigate = useNavigate();

    // 1. Tambahkan state untuk setiap input field
    const [level, setLevel] = useState('S1');
    const [institution, setInstitution] = useState('');
    const [major, setMajor] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [gpa, setGpa] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 2. Buat fungsi untuk handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!level || !institution || !major || !startDate) {
            Swal.fire('Data Tidak Lengkap', 'Mohon isi semua field yang wajib diisi.', 'warning');
            return;
        }

        setIsLoading(true);

        try {
            const educationData: Omit<EducationData, 'id' | 'createdAt' | 'updatedAt'> = {
                level,
                institution,
                major,
                startDate,
                endDate: endDate || null,
                gpa: gpa ? parseFloat(gpa) : null
            };
            
            // 3. Panggil API untuk menyimpan data
            await addEducation(educationData);

            // 4. Jika berhasil, arahkan ke langkah selanjutnya
            navigate('/pengalamanfill');

        } catch (err: any) {
            console.error("Failed to add education:", err);
            Swal.fire('Error', err.message || 'Gagal menyimpan data pendidikan.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkip = () => {
        Swal.fire({
            title: 'Anda yakin ingin melewati langkah ini?',
            text: "Anda dapat melengkapi profil Anda nanti di halaman pengaturan akun.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Lewati',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/');
            }
        });
    };

    return (
        <div className="min-h-screen flex">
            <div className="w-full md:w-1/2 px-6 md:px-16 py-10 bg-white">
                {/* Header & Progress */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/"><ArrowLeft className="w-5 h-5 text-gray-500 cursor-pointer" /></Link>
                    <div className="flex gap-2 flex-1 justify-center">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className={`h-2 w-8 rounded-full ${index < currentStep ? 'bg-yellow-400' : 'bg-gray-200'}`} />
                        ))}
                    </div>
                </div>

                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Pendidikan Terakhir</h2>
                    <p className="text-sm text-gray-600 mb-8">Isilah riwayat pendidikan Anda dengan benar. Anda juga bisa melewatinya untuk saat ini.</p>

                    {/* 5. Ganti form dengan state yang dikelola */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pendidikan Terakhir</label>
                            <div className="relative">
                                <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300">
                                    <option value="SMA/SMK Sederajat">SMA/SMK Sederajat</option>
                                    <option value="Diploma (D1-D4)">Diploma (D1-D4)</option>
                                    <option value="Sarjana (S1)">Sarjana (S1)</option>
                                    <option value="Magister (S2)">Magister (S2)</option>
                                    <option value="Doktor (S3)">Doktor (S3)</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                                <GraduationCap className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Institusi/Sekolah</label>
                            <div className="relative"><input type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Masukkan nama institusi" required className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300" /><Building className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" /></div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jurusan Pendidikan</label>
                            <div className="relative"><input type="text" value={major} onChange={(e) => setMajor(e.target.value)} placeholder="Masukkan jurusan" required className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300" /><BookOpenText className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" /></div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2"><label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label><div className="relative"><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300" /><CalendarCheck className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" /></div></div>
                            <div className="w-1/2"><label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kelulusan</label><div className="relative"><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300" /><CalendarCheck className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" /></div></div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nilai/GPA (Opsional)</label>
                            <input type="number" step="0.01" value={gpa} onChange={(e) => setGpa(e.target.value)} placeholder="Contoh: 3.75" className="w-full p-2 rounded-lg border border-gray-300" />
                        </div>
                        
                        {/* 6. Ubah tombol `<a>` menjadi `<button type="submit">` */}
                        <div className="pt-4 space-y-3">
                            <button type="submit" disabled={isLoading} className="w-full text-center bg-blue-900 text-white py-2.5 rounded-lg hover:bg-blue-800 font-semibold transition disabled:opacity-70">
                                {isLoading ? 'Menyimpan...' : 'Berikutnya'}
                            </button>
                             <button type="button" onClick={handleSkip} className="block w-full text-center bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 font-semibold transition">
                                Lewati
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="hidden md:flex w-1/2 bg-yellow-400 items-center justify-center">
                <img src="/pendidikan-illustration.png" alt="Pendidikan" className="max-w-[70%]" onError={(e) => {(e.target as HTMLImageElement).src='https://placehold.co/600x400/FFC107/FFFFFF?text=Ilustrasi'}}/>
            </div>
        </div>
    );
};

export default FillPendidikan;
