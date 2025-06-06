// src/components/RecommendComp/RecommendationComponents.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { type RecommendedJob, type UserSkill } from '../../types';
import { Briefcase, Zap, ThumbsUp, Edit3, UserCheck, Loader2, Search, Bookmark } from 'lucide-react';

// --- Header Component ---
interface RecommendationHeaderProps {
    hardSkills: UserSkill[];
    softSkills: UserSkill[];
    onGetRecommendations: () => void;
    isLoading: boolean;
}

export const RecommendationHeader: React.FC<RecommendationHeaderProps> = ({ hardSkills, softSkills, onGetRecommendations, isLoading }) => {
    const navigate = useNavigate();

    const renderSkillPills = (skills: UserSkill[], color: 'blue' | 'green') => (
        <div className="flex flex-wrap gap-2 mt-1">
            {skills.length > 0 ? skills.map(skill => (
                <span key={skill.id || skill.name} className={`text-xs font-medium px-2.5 py-1 rounded-full bg-${color}-100 text-${color}-700`}>
                    {skill.name} <span className="text-xs opacity-75">({skill.level})</span>
                </span>
            )) : <p className="text-xs text-gray-500 italic">Belum ada.</p>}
        </div>
    );
    
    return (
        <div className="mb-8 p-6 bg-sky-50 border border-sky-200 rounded-lg">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-sky-700 flex items-center">
                    <UserCheck size={22} className="mr-2" /> Dasar Rekomendasi: Keahlian Anda
                </h2>
                <button 
                    onClick={() => navigate('/profile/edit', { state: { initialTab: 'skills' } })}
                    className="text-xs text-sky-600 hover:text-sky-800 hover:underline flex items-center"
                    title="Edit Keahlian Anda"
                >
                    <Edit3 size={14} className="mr-1"/> Edit Keahlian
                </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
                Sistem akan mencarikan lowongan yang paling cocok dengan daftar hard skills dan soft skills yang telah Anda tambahkan di profil.
            </p>
            <div className="space-y-4">
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center"><Zap size={16} className="mr-1.5 text-blue-500"/>Hard Skills:</h4>
                    {renderSkillPills(hardSkills, 'blue')}
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center"><ThumbsUp size={16} className="mr-1.5 text-green-500"/>Soft Skills:</h4>
                    {renderSkillPills(softSkills, 'green')}
                </div>
                 {(hardSkills.length === 0 && softSkills.length === 0) && (
                    <div className="text-center py-4 px-3 bg-yellow-50 border border-yellow-300 rounded-md mt-4">
                        <p className="text-sm text-yellow-700">Anda belum menambahkan keahlian. Rekomendasi tidak dapat dibuat.</p>
                    </div>
                 )}
            </div>
             <div className="text-center mt-6">
                <button
                    onClick={onGetRecommendations}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <><Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" /> Mencari...</> : <><Search size={20} className="mr-2" /> Dapatkan Rekomendasi</>}
                </button>
            </div>
        </div>
    );
};


// --- Job Card Component ---
interface RecommendedJobCardProps {
    job: RecommendedJob;
    isBookmarked: boolean;
    onToggleBookmark: (jobId: string) => void;
}
export const RecommendedJobCard: React.FC<RecommendedJobCardProps> = ({ job, isBookmarked, onToggleBookmark }) => {

    const getScoreColor = (score: number) => {
        if (score >= 0.75) return 'bg-green-100 text-green-800';
        if (score >= 0.50) return 'bg-yellow-100 text-yellow-800';
        return 'bg-orange-100 text-orange-800';
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-blue-600 hover:underline">
                            <Link to={`/jobdetail/${job.id}`}>{job.jobTitle}</Link>
                        </h3>
                        <p className="text-sm text-gray-700">{job.companyName}</p>
                        <p className="text-xs text-gray-500">{job.location}</p>
                    </div>
                    {job.similarityScore !== undefined && (
                        <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${getScoreColor(job.similarityScore)}`}>
                            {(job.similarityScore * 100).toFixed(0)}% Cocok
                        </span>
                    )}
                </div>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {job.jobDescription}
                </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end space-x-3">
                <button title={isBookmarked ? "Hapus dari Bookmark" : "Simpan Pekerjaan"} onClick={() => onToggleBookmark(job.id)} className={`p-2 rounded-full transition-colors ${isBookmarked ? 'text-blue-600 bg-blue-100 hover:bg-blue-200' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'}`}>
                    <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
                </button>
                <Link to={`/jobdetail/${job.id}`} className="text-sm bg-blue-900 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
                    Lihat Detail
                </Link>
            </div>
        </div>
    );
};


// --- List Component ---
interface RecommendationListProps {
    recommendations: RecommendedJob[];
    bookmarkedJobIds: Set<string>;
    onToggleBookmark: (jobId: string) => void;
}
export const RecommendationList: React.FC<RecommendationListProps> = ({ recommendations, bookmarkedJobIds, onToggleBookmark }) => {
    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-1 mt-10 flex items-center">
                <Briefcase size={26} className="mr-2 text-gray-600" /> Pekerjaan yang Direkomendasikan
            </h2>
            <p className="text-sm text-gray-500 mb-6">Berikut adalah pekerjaan yang paling sesuai berdasarkan keahlian Anda.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((job) => (
                    <RecommendedJobCard 
                        key={job.id} 
                        job={job} 
                        isBookmarked={bookmarkedJobIds.has(job.id)}
                        onToggleBookmark={onToggleBookmark}
                    />
                ))}
            </div>
        </div>
    );
};
