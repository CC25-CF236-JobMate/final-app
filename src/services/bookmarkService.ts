// src/services/bookmarkService.ts
import { auth, db } from '../services/firebase';
import { doc, getDoc, type DocumentData } from "firebase/firestore";
import { type DisplayJob } from './jobService'; // Pastikan tipe ini tersedia dan sesuai
import { FieldValue } from "firebase/firestore";

const API_BASE_URL = 'https://jobseeker-capstone-705829099986.asia-southeast2.run.app';

export interface Bookmark {
  id: string; // Document ID of the bookmark itself
  jobId: string; // ID of the bookmarked job
  bookmarkedAt: {
    _seconds: number;
    _nanoseconds: number;
  } | Date;
}

// Tipe gabungan yang menyertakan detail pekerjaan
export interface EnrichedBookmark extends Bookmark {
    jobDetails: DisplayJob | null;
}

// Helper function to get the authentication token
const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

/**
 * Fetches the raw list of bookmarks (containing job IDs) for the current user.
 */
export const getBookmarks = async (): Promise<Bookmark[]> => {
  const token = await getIdToken();
  if (!token) throw new Error('User not authenticated');

  const response = await fetch(`${API_BASE_URL}/bookmarks`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch bookmarks');
  }
  
  const result = await response.json();
  return result.bookmarks || [];
};

/**
 * A helper function to fetch full job details for a single job ID.
 * @param jobId The ID of the job to fetch.
 */
const fetchJobById = async (jobId: string): Promise<DisplayJob | null> => {
    try {
        const jobRef = doc(db, "jobs", jobId);
        const jobSnap = await getDoc(jobRef);

        if (jobSnap.exists()) {
            const jobData = jobSnap.data() as DocumentData;
            
            const companyId = jobData.companyId;
            let companyData: DocumentData = {};
            if (companyId) {
                const companyRef = doc(db, "companies", companyId);
                const companySnap = await getDoc(companyRef);
                if (companySnap.exists()) {
                    companyData = companySnap.data();
                }
            }

            const postedAt = jobData.postedAt;
            const jobTypeString = jobData.jobType || '';

            return {
                id: jobSnap.id,
                title: jobData.jobTitle || 'Judul Tidak Tersedia',
                companyName: jobData.companyName || companyData.companyName || 'Nama Perusahaan Tidak Diketahui',
                companyLogo: companyData.logoUrl || '', 
                location: jobData.location || 'Lokasi Tidak Diketahui',
                postedDate: (postedAt && typeof postedAt.toDate === 'function') ? postedAt.toDate() : new Date(),
                salary: jobData.salary || null,
                skillsRequired: Array.isArray(jobData.skillsRequired) ? jobData.skillsRequired : [],
                type: jobTypeString ? [jobTypeString] : [],
                employmentType: jobTypeString, // Untuk kompatibilitas
                posted: jobData.posted || '', 
                logo: jobData.companyName || 'C',
            };
        }
        return null;
    } catch (error) {
        console.error(`Error fetching job with ID ${jobId}:`, error);
        return null;
    }
};


/**
 * Fetches bookmarks and enriches them with full job details.
 */
export const getEnrichedBookmarks = async (): Promise<EnrichedBookmark[]> => {
  const bookmarks = await getBookmarks();
  if (bookmarks.length === 0) {
    return [];
  }

  const enrichedPromises = bookmarks.map(async (bookmark) => {
    const jobDetails = await fetchJobById(bookmark.jobId);
    return {
        ...bookmark, // Mengandung bookmark.id dan bookmark.jobId
        jobDetails,
    };
  });
  
  const results = await Promise.all(enrichedPromises);

  // Filter out bookmarks where the job might have been deleted
  return results.filter((b): b is EnrichedBookmark => b.jobDetails !== null);
};

/**
 * [FUNGSI BARU] Adds a job to the user's bookmarks.
 * Calls POST /bookmarks
 * @param jobId The ID of the job to bookmark.
 */
export const addBookmark = async (jobId: string): Promise<any> => {
  const token = await getIdToken();
  if (!token) throw new Error('User not authenticated');

  const response = await fetch(`${API_BASE_URL}/bookmarks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jobId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to add bookmark');
  }
  return response.json();
};


/**
 * [FUNGSI LAMA] Removes a job from the user's bookmarks using the bookmark's document ID.
 * Calls DELETE /bookmarks/:id
 * @param bookmarkId The document ID of the bookmark to remove.
 */
export const removeBookmark = async (bookmarkId: string): Promise<any> => {
  const token = await getIdToken();
  if (!token) throw new Error('User not authenticated');
  if (!bookmarkId) throw new Error('Bookmark ID is required for deletion.');

  const response = await fetch(`${API_BASE_URL}/bookmarks/${bookmarkId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to remove bookmark');
  }
  return response.json();
};

/**
 * [FUNGSI BARU] Removes a job from the user's bookmarks using the Job ID.
 * Calls DELETE /bookmarked/:jobId
 * @param jobId The ID of the job to remove from bookmarks.
 */
export const removeBookmarkByJobId = async (jobId: string): Promise<any> => {
  const token = await getIdToken();
  if (!token) throw new Error('User not authenticated');
  if (!jobId) throw new Error('Job ID is required for deletion.');


  const response = await fetch(`${API_BASE_URL}/bookmarked/${jobId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to remove bookmark by job ID');
  }
  return response.json();
};
