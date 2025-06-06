// src/types.ts

// Tipe untuk keahlian pengguna
export interface UserSkill {
    id: string;
    name: string;
    level: string;
}

// Tipe data dasar untuk pekerjaan
export interface JobData {
    id: string;
    jobTitle?: string;
    companyName?: string;
    location?: string;
    jobDescription?: string;
    skillsRequired?: string[];
    category?: string;
    jobType?: string;
    postedAt?: Date;
    salary?: {
        min?: number;
        max?: number;
        currency?: string;
    };
}

// Tipe pekerjaan yang direkomendasikan, dengan skor kemiripan
export interface RecommendedJob extends JobData {
    similarityScore?: number;
}
