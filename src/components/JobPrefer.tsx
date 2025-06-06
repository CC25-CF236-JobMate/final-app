// src/components/PreferenceComp/JobPrefer.tsx
import React, { useState } from 'react';
import {  ArrowLeft, DollarSign } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { setPreferences, validJobTypes } from '../services/PreferenceService';
import Swal from 'sweetalert2';
import CurrencyInput from 'react-currency-input-field';

const JobPrefer: React.FC = () => {
    const currentStep = 4;
    const navigate = useNavigate();

    const [jobCategories, setJobCategories] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [jobTypes, setJobTypes] = useState<string[]>([]);
    const [salaryExpectation, setSalaryExpectation] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (jobCategories.length === 0 || locations.length === 0 || jobTypes.length === 0) {
            Swal.fire("Data Kurang Lengkap", "Mohon isi Kategori, Lokasi, dan Tipe Pekerjaan.", "warning");
            return;
        }
        setIsLoading(true);
        try {
            await setPreferences({ 
                jobCategories, 
                locations, 
                jobTypes, 
                salaryExpectation 
            });
            navigate('/jobstatus');
        } catch (err: any) {
            Swal.fire("Error", err.message || "Gagal menyimpan preferensi.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkip = () => navigate('/jobstatus');

    return (
        <div className="min-h-screen flex">
            <div className="w-full md:w-1/2 bg-white px-6 md:px-16 py-10">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/skillfill"><ArrowLeft className="w-5 h-5 text-gray-500 cursor-pointer" /></Link>
                    <div className="flex gap-2 flex-1 justify-center">
                        {[...Array(5)].map((_, index) => <div key={index} className={`h-2 w-8 rounded-full ${index < currentStep ? 'bg-yellow-400' : 'bg-gray-200'}`} />)}
                    </div>
                </div>
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Preferensi Pekerjaan</h2>
                    <p className="text-sm text-gray-600 mb-8">Isi preferensi untuk mendapatkan rekomendasi yang paling sesuai.</p>
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Pekerjaan</label>
                            <CreatableSelect isMulti onChange={(opts) => setJobCategories(opts.map(o => o.value))} placeholder="Ketik atau pilih kategori..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi yang Diinginkan</label>
                            <CreatableSelect isMulti onChange={(opts) => setLocations(opts.map(o => o.value))} placeholder="Ketik atau pilih lokasi..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Pekerjaan</label>
                            <Select isMulti options={validJobTypes.map(t => ({ value: t, label: t }))} onChange={(opts) => setJobTypes(opts.map(o => o.value))} placeholder="Pilih tipe pekerjaan..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ekspektasi Gaji Bulanan (Opsional)</label>
                            <div className="relative"><CurrencyInput id="salary" name="salary" placeholder="Contoh: 8000000" className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300" prefix="Rp " groupSeparator="." onValueChange={(value) => setSalaryExpectation(value ? parseInt(value) : null)} /><DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /></div>
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
            </div>
            <div className="hidden md:flex w-1/2 bg-yellow-400 items-center justify-center p-10">
                <img src="/job-preference-illustration.svg" alt="Ilustrasi" className="max-w-full h-auto" onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400/FFC107/FFFFFF?text=Ilustrasi')} />
            </div>
        </div>
    );
};
export default JobPrefer;
