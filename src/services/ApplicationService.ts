// src/services/applicationService.ts
import { auth, db } from '../services/firebase';
import { doc, getDoc, type DocumentData, FieldValue } from "firebase/firestore";
import { type DisplayJob } from './jobService'; // Assuming this type is available and comprehensive

const API_BASE_URL = 'https://jobseeker-capstone-705829099986.asia-southeast2.run.app';

export const applicationStatuses = ['pending', 'reviewed', 'interview', 'offered', 'rejected'] as const;
export type ApplicationStatus = typeof applicationStatuses[number];

export interface Application {
  id: string; // Document ID of the application itself
  jobId: string;
  status: ApplicationStatus;
  resumeUrl: string;
  coverLetter?: string;
  notes?: string;
  appliedAt: {
    _seconds: number;
    _nanoseconds: number;
  } | Date | FieldValue;
}

// Interface for the combined data of an application and its job details
export interface AppliedJob extends Application {
    jobDetails?: DisplayJob | null;
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
 * [FUNGSI BARU] Submits a new job application.
 * Calls POST /applications
 * @param payload - The application data containing jobId, resumeFile (base64), etc.
 */
export const submitApplication = async (payload: {
    jobId: string;
    resumeFile: string;
    coverLetter?: string;
    notes?: string;
}): Promise<any> => {
    const token = await getIdToken();
    if (!token) {
        throw new Error('User not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
        // Berikan pesan error yang lebih spesifik dari backend jika ada
        throw new Error(responseData.error || 'Failed to submit application');
    }

    return responseData;
};


/**
 * Fetches the raw list of applications for the current user.
 */
export const getApplications = async (): Promise<Application[]> => {
  const token = await getIdToken();
  if (!token) throw new Error('User not authenticated');

  const response = await fetch(`${API_BASE_URL}/applications`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch applications');
  }
  
  const result = await response.json();
  return result.applications || [];
};

/**
 * A helper function to fetch full job details for a single job ID.
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
                if (companySnap.exists()) companyData = companySnap.data();
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
                employmentType: jobTypeString,
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
 * Fetches applications and enriches them with full job details.
 */
export const getAppliedJobs = async (): Promise<AppliedJob[]> => {
  const applications = await getApplications();
  if (applications.length === 0) return [];

  const appliedJobsPromises = applications.map(async (app) => {
    const jobDetails = await fetchJobById(app.jobId);
    return { ...app, jobDetails };
  });

  const appliedJobs = await Promise.all(appliedJobsPromises);
  return appliedJobs.filter(app => app.jobDetails !== null);
};

/**
 * Withdraws (deletes) a job application based on the API endpoint DELETE /applications/:applicationId.
 * @param applicationId The ID of the application document to delete.
 */
export const withdrawApplication = async (applicationId: string): Promise<any> => {
  const token = await getIdToken();
  if (!token) throw new Error('User not authenticated');
  if (!applicationId) throw new Error('Application ID is required for withdrawal.');

  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to withdraw application');
  }
  return response.json();
};
