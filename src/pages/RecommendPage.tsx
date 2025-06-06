// src/pages/RecommendPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { RecommendationHeader, RecommendationList } from '../components/RecommendComp/RecommendComponent';
import { fetchUserSkills, fetchAllJobsForMatching, cosineSimilarity } from '../services/recommendationService';
import { addBookmark, removeBookmarkByJobId, getBookmarks } from '../services/bookmarkService';
import { type JobData, type RecommendedJob, type UserSkill } from '../types';
import Swal from 'sweetalert2';
import { Loader2 } from 'lucide-react';

const RecommendPage: React.FC = () => {
  const [userSkills, setUserSkills] = useState<{ hardSkills: UserSkill[], softSkills: UserSkill[] }>({ hardSkills: [], softSkills: [] });
  const [allJobs, setAllJobs] = useState<JobData[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendedJob[]>([]);
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState<Set<string>>(new Set());
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRecommending, setIsRecommending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Fetch all initial data (user skills, all jobs, existing bookmarks)
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        const [skillsData, jobsData, bookmarksData] = await Promise.all([
            fetchUserSkills(),
            fetchAllJobsForMatching(),
            getBookmarks()
        ]);
        setUserSkills(skillsData);
        setAllJobs(jobsData);
        setBookmarkedJobIds(new Set(bookmarksData.map(b => b.jobId)));
    } catch (err: any) {
        console.error("Error loading initial data for recommendations:", err);
        setError(err.message || "Gagal memuat data yang diperlukan untuk rekomendasi.");
        Swal.fire("Error", `Gagal memuat data: ${err.message}`, "error");
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleGetRecommendations = () => {
    if (userSkills.hardSkills.length === 0 && userSkills.softSkills.length === 0) {
      Swal.fire({
        title: "Keahlian Kosong",
        text: "Anda belum menambahkan keahlian pada profil. Silakan tambahkan terlebih dahulu untuk mendapatkan rekomendasi.",
        icon: "warning",
        confirmButtonText: "Tambah Keahlian",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/profile/edit', { state: { initialTab: 'skills' } });
        }
      });
      return;
    }

    setIsRecommending(true);
    setRecommendations([]); // Clear previous recommendations
    
    // Simulate processing time
    setTimeout(() => {
        try {
            const userProfileSkills = [
                ...userSkills.hardSkills.map(s => s.name.toLowerCase().trim()),
                ...userSkills.softSkills.map(s => s.name.toLowerCase().trim())
            ].filter(Boolean);

            const allSkillNames = new Set<string>(userProfileSkills);
            allJobs.forEach(job => (job.skillsRequired || []).forEach(skill => allSkillNames.add(skill.toLowerCase().trim())));
            
            const vocabulary = Array.from(allSkillNames).sort();
            const userVector = vocabulary.map(vocabSkill => userProfileSkills.includes(vocabSkill) ? 1 : 0);
            
            const jobRecommendations = allJobs.map(job => {
                const jobSkills = (job.skillsRequired || []).map(s => s.toLowerCase().trim());
                const jobVector = vocabulary.map(vocabSkill => jobSkills.includes(vocabSkill) ? 1 : 0);
                const score = cosineSimilarity(userVector, jobVector);
                return { ...job, similarityScore: score };
            })
            .filter(job => (job.similarityScore || 0) > 0.01) // Filter out jobs with very low or zero similarity
            .sort((a, b) => (b.similarityScore || 0) - (a.similarityScore || 0))
            .slice(0, 10); // Get top 10

            if (jobRecommendations.length === 0) {
                Swal.fire("Info", "Tidak ada rekomendasi pekerjaan yang cocok ditemukan berdasarkan keahlian Anda saat ini.", "info");
            }

            setRecommendations(jobRecommendations);
        } catch (err: any) {
            console.error("Error calculating recommendations:", err);
            setError(`Gagal menghitung rekomendasi: ${err.message}`);
        } finally {
            setIsRecommending(false);
        }
    }, 500);
  };
  
  const handleToggleBookmark = async (jobId: string) => {
    if (!auth.currentUser) {
        Swal.fire("Login Dibutuhkan", "Anda harus login untuk mengubah status bookmark.", "warning");
        return;
    }
    const isBookmarked = bookmarkedJobIds.has(jobId);
    try {
        if (isBookmarked) {
            await removeBookmarkByJobId(jobId);
            setBookmarkedJobIds(prev => { const newSet = new Set(prev); newSet.delete(jobId); return newSet; });
        } else {
            await addBookmark(jobId);
            setBookmarkedJobIds(prev => new Set(prev).add(jobId));
        }
    } catch (err: any) {
        Swal.fire("Error", err.message || "Gagal memproses bookmark.", "error");
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <RecommendationHeader 
            hardSkills={userSkills.hardSkills} 
            softSkills={userSkills.softSkills} 
            onGetRecommendations={handleGetRecommendations}
            isLoading={isRecommending || isLoading}
          />

          {error && !isLoading && (
            <div className="my-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md text-center">{error}</div>
          )}
          
          {isLoading ? (
             <div className="flex items-center justify-center text-gray-500 py-10">
                <Loader2 className="animate-spin mr-2" size={20} /> Memuat data awal...
             </div>
          ) : recommendations.length > 0 && !isRecommending ? (
             <RecommendationList 
                recommendations={recommendations}
                bookmarkedJobIds={bookmarkedJobIds}
                onToggleBookmark={handleToggleBookmark}
             />
          ) : !isRecommending && recommendations.length === 0 ? (
             <div className="text-center py-10 mt-6 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Klik tombol "Dapatkan Rekomendasi" untuk memulai.</p>
             </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecommendPage;
