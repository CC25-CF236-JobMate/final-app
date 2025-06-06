// src/services/companyService.ts
import { FieldValue } from "firebase/firestore";

const API_BASE_URL = 'https://jobseeker-capstone-705829099986.asia-southeast2.run.app';

export interface Company {
  id: string;
  companyName: string;
  city: string;
  aboutCompany: string;
  activeJobCount: number;
  website?: string;
  phone?: string;
  industry?: string;
  email?: string;
  createdAt?: {
    _seconds: number;
    _nanoseconds: number;
  } | Date | FieldValue;
}

interface CompanyFilter {
  city?: string;
  minActiveJobCount?: number;
}

/**
 * Fetches a list of all companies or filters them based on criteria.
 * @param filters - Optional filter object for city and minActiveJobCount.
 */
export const fetchCompanies = async (filters: CompanyFilter = {}): Promise<Company[]> => {
  const params = new URLSearchParams();
  if (filters.city) {
    params.append('city', filters.city);
  }
  if (filters.minActiveJobCount) {
    params.append('minActiveJobCount', filters.minActiveJobCount.toString());
  }

  // Choose endpoint based on whether filters are applied
  const endpoint = params.toString() ? 'companiesFilter' : 'companies';
  const url = `${API_BASE_URL}/${endpoint}?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal memuat data perusahaan');
  }
  
  const result = await response.json();
  return result.companies || [];
};

/**
 * Fetches the details for a single company by its ID.
 * @param companyId - The ID of the company to fetch.
 */
export const fetchCompanyById = async (companyId: string): Promise<Company> => {
  if (!companyId) {
    throw new Error('Company ID is required');
  }
  
  const response = await fetch(`${API_BASE_URL}/companies/${companyId}/detail`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 404) {
      throw new Error('Perusahaan tidak ditemukan');
    }
    throw new Error(errorData.error || 'Gagal memuat detail perusahaan');
  }

  return response.json();
};
