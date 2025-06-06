// src/components/RecommendComp/RecommendationComponents.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { type RecommendedJob, type UserSkill } from '../../types';
import { Briefcase, Zap, ThumbsUp, Edit3, UserCheck, Loader2, Search, Bookmark, Sparkles, Target } from 'lucide-react';

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
        <div className="flex flex-wrap gap-2 mt-2">
            {skills.length > 0 ? skills.map(skill => (
                <span 
                    key={skill.id || skill.name} 
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105 shadow-sm ${
                        color === 'blue' 
                            ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200/50' 
                            : 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200/50'
                    }`}
                >
                    {skill.name} <span className="text-xs opacity-75 font-medium">({skill.level})</span>
                </span>
            )) : <p className="text-sm text-gray-500 italic">Belum ada keahlian yang ditambahkan.</p>}
        </div>
    );
    
    return (
        <section className="relative mb-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-20 right-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-10 left-1/2 w-24 h-24 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
            </div>

            <div className="relative">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-sm">
                        <Target size={14} className="text-blue-600" />
                        <span>Rekomendasi Berdasarkan Keahlian</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight mb-3">
                        Pekerjaan yang Tepat untuk Anda
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                        Sistem akan mencarikan lowongan yang paling cocok dengan daftar hard skills dan soft skills yang telah Anda tambahkan di profil
                    </p>
                </div>

                {/* Enhanced Skills Container */}
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl shadow-blue-900/10 p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mr-3">
                                <UserCheck size={18} className="text-blue-600" />
                            </div>
                            Keahlian Anda
                        </h3>
                        <button 
                            onClick={() => navigate('/profile/edit', { state: { initialTab: 'skills' } })}
                            className="group text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100 transition-all duration-300 transform hover:scale-105"
                            title="Edit Keahlian Anda"
                        >
                            <Edit3 size={16} className="group-hover:rotate-12 transition-transform duration-300"/> 
                            Edit Keahlian
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-2xl border border-blue-200/30">
                            <h4 className="text-base font-bold text-gray-800 mb-3 flex items-center">
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-2">
                                    <Zap size={14} className="text-white"/>
                                </div>
                                Hard Skills
                            </h4>
                            {renderSkillPills(hardSkills, 'blue')}
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-6 rounded-2xl border border-green-200/30">
                            <h4 className="text-base font-bold text-gray-800 mb-3 flex items-center">
                                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-2">
                                    <ThumbsUp size={14} className="text-white"/>
                                </div>
                                Soft Skills
                            </h4>
                            {renderSkillPills(softSkills, 'green')}
                        </div>
                    </div>

                    {(hardSkills.length === 0 && softSkills.length === 0) && (
                        <div className="text-center py-6 px-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl mt-6 shadow-sm">
                            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-yellow-800 mb-2">Belum Ada Keahlian</p>
                            <p className="text-xs text-yellow-700">Tambahkan keahlian terlebih dahulu untuk mendapatkan rekomendasi pekerjaan yang tepat</p>
                        </div>
                    )}

                    <div className="text-center mt-8">
                        <button
                            onClick={onGetRecommendations}
                            disabled={isLoading || (hardSkills.length === 0 && softSkills.length === 0)}
                            className="group bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 mx-auto"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin w-5 h-5" /> 
                                    <span>Mencari Rekomendasi...</span>
                                </>
                            ) : (
                                <>
                                    <Search size={20} className="group-hover:scale-110 transition-transform duration-200" /> 
                                    <span>Dapatkan Rekomendasi</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </section>
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
        if (score >= 0.75) return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
        if (score >= 0.50) return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200';
        return 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200';
    };

    return (
        <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 hover:border-blue-200 flex flex-col justify-between transform hover:scale-105 hover:-translate-y-1">
            <div>
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-grow">
                        <h3 className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300 mb-1">
                            <Link to={`/jobdetail/${job.id}`} className="hover:underline">
                                {job.jobTitle}
                            </Link>
                        </h3>
                        <p className="text-sm font-semibold text-gray-600 mb-1">{job.companyName}</p>
                        <p className="text-xs text-gray-500 flex items-center">
                            <div className="w-3 h-3 bg-gray-300 rounded-full mr-1.5"></div>
                            {job.location}
                        </p>
                    </div>
                    {job.similarityScore !== undefined && (
                        <div className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border shadow-sm ${getScoreColor(job.similarityScore)}`}>
                            {(job.similarityScore * 100).toFixed(0)}% Match
                        </div>
                    )}
                </div>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {job.jobDescription}
                </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <button 
                    title={isBookmarked ? "Hapus dari Bookmark" : "Simpan Pekerjaan"} 
                    onClick={() => onToggleBookmark(job.id)} 
                    className={`group/bookmark p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                        isBookmarked 
                            ? 'text-blue-600 bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-200 shadow-sm' 
                            : 'text-gray-400 hover:text-blue-500 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200'
                    }`}
                >
                    <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} className="group-hover/bookmark:scale-110 transition-transform duration-200" />
                </button>
                
                <Link 
                    to={`/jobdetail/${job.id}`} 
                    className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
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
        <section className="relative">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
            
            <div className="relative">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-blue-100 border border-green-200/50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-sm">
                        <Sparkles size={14} className="text-green-600" />
                        <span>Hasil Rekomendasi</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-green-900 bg-clip-text text-transparent leading-tight mb-2 flex items-center justify-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                            <Briefcase size={22} className="text-white" />
                        </div>
                        Pekerjaan yang Direkomendasikan
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base">
                        {recommendations.length} pekerjaan yang paling sesuai berdasarkan keahlian Anda
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recommendations.map((job, index) => (
                        <div 
                            key={job.id}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <RecommendedJobCard 
                                job={job} 
                                isBookmarked={bookmarkedJobIds.has(job.id)}
                                onToggleBookmark={onToggleBookmark}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};