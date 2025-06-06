// src/components/SkillComp/SkillFill.tsx
import React, { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Select, { type SingleValue } from 'react-select';
import { addHardSkills, addSoftSkills } from '../services/SkillsService';
import Swal from 'sweetalert2';

type SelectOption = { value: string; label: string; };
interface SkillEntry { skill: SelectOption; level: SelectOption; }

const allSkillsOptions: SelectOption[] = [ { value: 'ReactJS', label: 'ReactJS' }, { value: 'Node.js', label: 'Node.js' }, { value: 'Project Management', label: 'Project Management' }, { value: 'Communication', label: 'Communication' }, { value: 'Teamwork', label: 'Teamwork' }, { value: 'Problem Solving', label: 'Problem Solving' }, { value: 'Leadership', label: 'Leadership' }, { value: 'Time Management', label: 'Time Management' }, ];
const levelOptions: SelectOption[] = [ { value: 'Pemula', label: 'Pemula' }, { value: 'Menengah', label: 'Menengah' }, { value: 'Mahir', label: 'Mahir' }, { value: 'Ahli', label: 'Ahli' }, ];

const SkillFill: React.FC = () => {
    const currentStep = 3;
    const navigate = useNavigate();
    
    const [hardSkills, setHardSkills] = useState<SkillEntry[]>([]);
    const [currentHardSkill, setCurrentHardSkill] = useState<SelectOption | null>(null);
    const [currentHardLevel, setCurrentHardLevel] = useState<SelectOption | null>(levelOptions[0]);

    const [softSkills, setSoftSkills] = useState<SkillEntry[]>([]);
    const [currentSoftSkill, setCurrentSoftSkill] = useState<SelectOption | null>(null);
    const [currentSoftLevel, setCurrentSoftLevel] = useState<SelectOption | null>(levelOptions[0]);
    
    const [isLoading, setIsLoading] = useState(false);

    const handleAddSkill = (type: 'hard' | 'soft') => {
        if (type === 'hard' && currentHardSkill && currentHardLevel) {
            if (!hardSkills.find(s => s.skill.value === currentHardSkill.value)) {
                setHardSkills([...hardSkills, { skill: currentHardSkill, level: currentHardLevel }]);
            }
            setCurrentHardSkill(null);
        } else if (type === 'soft' && currentSoftSkill && currentSoftLevel) {
            if (!softSkills.find(s => s.skill.value === currentSoftSkill.value)) {
                setSoftSkills([...softSkills, { skill: currentSoftSkill, level: currentSoftLevel }]);
            }
            setCurrentSoftSkill(null);
        }
    };

    const handleRemoveSkill = (skillValue: string, type: 'hard' | 'soft') => {
        if (type === 'hard') setHardSkills(hardSkills.filter(s => s.skill.value !== skillValue));
        else setSoftSkills(softSkills.filter(s => s.skill.value !== skillValue));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (hardSkills.length === 0 && softSkills.length === 0) {
            Swal.fire("Keahlian Kosong", "Mohon tambahkan setidaknya satu keahlian.", "warning");
            return;
        }
        setIsLoading(true);
        try {
            const hardSkillsPayload = hardSkills.map(s => ({ name: s.skill.value, level: s.level.value }));
            const softSkillsPayload = softSkills.map(s => ({ name: s.skill.value, level: s.level.value }));
            
            // Kirim kedua jenis skill secara paralel
            await Promise.all([
                hardSkillsPayload.length > 0 ? addHardSkills(hardSkillsPayload) : Promise.resolve(),
                softSkillsPayload.length > 0 ? addSoftSkills(softSkillsPayload) : Promise.resolve(),
            ]);

            navigate('/jobpreferfill');
        } catch (err: any) {
            Swal.fire("Error", err.message || "Gagal menyimpan keahlian.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkip = () => navigate('/jobpreferfill');

    return (
        <div className="min-h-screen flex">
            <div className="w-full md:w-1/2 bg-white px-6 md:px-16 py-10 overflow-y-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/pengalamanfill"><ArrowLeft className="w-5 h-5 text-gray-500 cursor-pointer" /></Link>
                    <div className="flex gap-2 flex-1 justify-center">
                        {[...Array(5)].map((_, index) => <div key={index} className={`h-2 w-8 rounded-full ${index < currentStep ? 'bg-yellow-400' : 'bg-gray-200'}`} />)}
                    </div>
                </div>
                <div className="max-w-lg mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">Tambahkan Skill Anda</h2>
                    <p className="text-sm text-gray-600 mb-8 text-center">Pisahkan antara Hard Skill dan Soft Skill yang Anda kuasai.</p>
                    <form onSubmit={handleSubmit}>
                        {/* Hard Skills Section */}
                        <div className="mb-8">
                            <h3 className="font-semibold text-lg mb-3 text-gray-800">Hard Skills</h3>
                            <div className="flex flex-col sm:flex-row items-center gap-2 mb-3">
                                <Select className="flex-1 w-full" options={allSkillsOptions} value={currentHardSkill} onChange={(o) => setCurrentHardSkill(o)} placeholder="Cari skill..." isClearable isSearchable />
                                <Select className="flex-1 w-full" options={levelOptions} value={currentHardLevel} onChange={(o) => setCurrentHardLevel(o)} placeholder="Pilih level..." />
                                <button type="button" onClick={() => handleAddSkill('hard')} className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 w-full sm:w-auto mt-2 sm:mt-0" disabled={!currentHardSkill || !currentHardLevel}>Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2 p-2 min-h-[40px] bg-gray-50 rounded-lg">
                                {hardSkills.map(s => (<div key={s.skill.value} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium pl-3 pr-2 py-1 rounded-full">{s.skill.label} ({s.level.label})<button onClick={() => handleRemoveSkill(s.skill.value, 'hard')} className="ml-2 hover:text-red-600"><X className="w-4 h-4" /></button></div>))}
                            </div>
                        </div>
                        {/* Soft Skills Section */}
                        <div className="mb-8">
                            <h3 className="font-semibold text-lg mb-3 text-gray-800">Soft Skills</h3>
                            <div className="flex flex-col sm:flex-row items-center gap-2 mb-3">
                                <Select className="flex-1 w-full" options={allSkillsOptions} value={currentSoftSkill} onChange={(o) => setCurrentSoftSkill(o)} placeholder="Cari skill..." isClearable isSearchable />
                                <Select className="flex-1 w-full" options={levelOptions} value={currentSoftLevel} onChange={(o) => setCurrentSoftLevel(o)} placeholder="Pilih level..." />
                                <button type="button" onClick={() => handleAddSkill('soft')} className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 w-full sm:w-auto mt-2 sm:mt-0" disabled={!currentSoftSkill || !currentSoftLevel}>Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2 p-2 min-h-[40px] bg-gray-50 rounded-lg">
                                {softSkills.map(s => (<div key={s.skill.value} className="flex items-center bg-green-100 text-green-800 text-sm font-medium pl-3 pr-2 py-1 rounded-full">{s.skill.label} ({s.level.label})<button onClick={() => handleRemoveSkill(s.skill.value, 'soft')} className="ml-2 hover:text-red-600"><X className="w-4 h-4" /></button></div>))}
                            </div>
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
            <div className="hidden md:flex w-1/2 bg-yellow-400 items-center justify-center">
                <img src="/skillfill-illustration.png" alt="Skill Illustration" className="max-w-[70%]" onError={(e) => {(e.target as HTMLImageElement).src='https://placehold.co/600x400/FFC107/FFFFFF?text=Ilustrasi'}}/>
            </div>
        </div>
    );
};

export default SkillFill;
