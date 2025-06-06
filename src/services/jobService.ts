// src/services/jobService.ts

// Interface untuk data mentah dari API
export interface ApiJob {
  id: string;
  jobTitle: string;
  jobDescription: string;
  cleanedDescription: string;
  companyName?: string; // Opsional, dengan nilai default jika tidak ada
  city: string;
  aboutCompany: string;
  category: string;
  jobType: string;
  skillsRequired: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  isActive: boolean;
  postedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  // Anda bisa menambahkan properti lain di sini jika API mengembalikannya
  // misalnya 'experienceLevel', 'workType', dll.
}

// Interface untuk respons API yang mengembalikan daftar pekerjaan
interface ApiResponse { 
  jobs: ApiJob[];
}

// Interface untuk data yang telah diformat dan siap ditampilkan di UI (untuk daftar/kartu)
export interface DisplayJob { 
  id: string;
  logo: string; // Biasanya inisial dari companyName
  companyName: string; // Dijamin string (ada nilai default jika API tidak menyediakan)
  title: string;
  disabilitas?: string; // Opsional, jika ada datanya
  type: string[]; // jobType dari API, dijadikan array
  location: string; // city dari API
  posted: string; // Tanggal posting yang sudah diformat
  description: string; // Deskripsi singkat, mungkin dipotong
  salary?: { // Objek salary untuk ditampilkan di kartu
    min: number;
    max: number;
    currency: string;
  };
  skillsRequired?: string[]; // Daftar keahlian
}

// Interface untuk parameter filter pada fungsi searchJobs
export interface SearchJobFilters { 
  category?: string;
  location?: string; // Filter 'location' umum dari API (jika berbeda dari city)
  minSalary?: number;
  maxSalary?: number;
  companyName?: string; // Untuk filter berdasarkan nama perusahaan
  city?: string;        // Untuk filter berdasarkan kota
  // lastDocId?: string; // Untuk pagination server-side (jika diimplementasikan)
}

const API_BASE_URL = 'https://jobseeker-capstone-705829099986.asia-southeast2.run.app';

// Fungsi helper untuk memformat tanggal posting
const formatPostedDate = (postedAtSeconds: number): string => {
  if (typeof postedAtSeconds !== 'number') return "Tanggal tidak valid";
  const date = new Date(postedAtSeconds * 1000);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (isNaN(diffDays) || diffDays < 0) return "Tanggal tidak valid";

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      if (diffMinutes < 1) return "Baru saja";
      return `${diffMinutes} menit yang lalu`;
    }
    return `${diffHours} jam yang lalu`;
  } else if (diffDays === 1) {
    return "Kemarin";
  } else if (diffDays <= 30) {
    return `${diffDays} hari yang lalu`;
  } else {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }
};

// Fungsi helper untuk mentransformasi data API mentah menjadi DisplayJob
const transformApiJobToDisplayJob = (apiJob: ApiJob): DisplayJob => {
  const companyName = apiJob.companyName || "Perusahaan Tidak Diketahui";
  let description = `Kami sedang mencari seorang ${apiJob.jobTitle.toLowerCase()}...`;
  if (apiJob.jobDescription) {
      description = apiJob.jobDescription.length > 150 
                    ? apiJob.jobDescription.substring(0, 147) + "..." 
                    : apiJob.jobDescription;
  }

  return {
    id: apiJob.id,
    logo: companyName, // Digunakan untuk inisial
    companyName: companyName,
    title: apiJob.jobTitle,
    type: [apiJob.jobType], 
    location: apiJob.city,
    posted: apiJob.postedAt ? formatPostedDate(apiJob.postedAt._seconds) : "Tanggal tidak tersedia",
    description: description,
    salary: apiJob.salary, // Teruskan objek salary
    skillsRequired: apiJob.skillsRequired || [], // Teruskan skills atau array kosong
    // disabilitas: apiJob.disabilityInfo, // Jika ada field ini di API
  };
};

// Fungsi untuk mengambil pekerjaan terbaru (untuk homepage)
export const fetchRecentJobs = async (): Promise<DisplayJob[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/recent`);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Error fetching recent jobs: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`Error fetching recent jobs: ${response.status} ${response.statusText}`);
    }
    const data: ApiResponse = await response.json();
    if (!data.jobs || !Array.isArray(data.jobs)) {
        console.error("Invalid data structure for recent jobs:", data);
        return [];
    }
    return data.jobs.map(transformApiJobToDisplayJob);
  } catch (error: unknown) {
    if (error instanceof Error) {
        console.error("Failed to fetch recent jobs:", error.message);
    } else {
        console.error("An unknown error occurred while fetching recent jobs:", error);
    }
    return [];
  }
};

// Fungsi untuk mencari pekerjaan dengan filter (untuk halaman pencarian)
export const searchJobs = async (filters: SearchJobFilters): Promise<DisplayJob[]> => {
  const queryParams = new URLSearchParams();
  if (filters.category) queryParams.append('category', filters.category);
  if (filters.location) queryParams.append('location', filters.location);
  if (filters.minSalary) queryParams.append('minSalary', String(filters.minSalary));
  if (filters.maxSalary) queryParams.append('maxSalary', String(filters.maxSalary));
  if (filters.companyName) queryParams.append('companyName', filters.companyName);
  if (filters.city) queryParams.append('city', filters.city);

  const url = `${API_BASE_URL}/jobs?${queryParams.toString()}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Error searching jobs: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`Error searching jobs: ${response.status} ${response.statusText}`);
    }
    const data: ApiResponse = await response.json();
    if (!data.jobs || !Array.isArray(data.jobs)) {
        console.error("Invalid data structure for searched jobs:", data);
        return [];
    }
    return data.jobs.map(transformApiJobToDisplayJob);
  } catch (error: unknown) {
     if (error instanceof Error) {
        console.error("Failed to search jobs:", error.message);
    } else {
        console.error("An unknown error occurred while searching jobs:", error);
    }
    return [];
  }
};

// Fungsi untuk mengambil detail pekerjaan berdasarkan ID (untuk halaman detail)
export const fetchJobById = async (jobId: string): Promise<ApiJob | null> => {
  const url = `${API_BASE_URL}/jobs/${jobId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Job with ID ${jobId} not found (404).`);
        return null;
      }
      const errorBody = await response.text();
      console.error(`Error fetching job by ID ${jobId}: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`Error fetching job by ID ${jobId}: ${response.status} ${response.statusText}`);
    }
    const jobData: ApiJob = await response.json(); 
    // Tidak ada transformasi ke DisplayJob di sini, karena halaman detail mungkin memerlukan semua field dari ApiJob
    return jobData;
  } catch (error: unknown) {
    if (error instanceof Error) {
        console.error(`Failed to fetch job by ID ${jobId}:`, error.message);
    } else {
        console.error(`An unknown error occurred while fetching job ID ${jobId}:`, error);
    }
    return null;
  }
};