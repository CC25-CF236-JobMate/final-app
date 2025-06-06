// src/services/portfolioService.ts
import { auth } from '../services/firebase'; // Your Firebase auth instance
import { FieldValue } from "firebase/firestore"; // Firestore type

const API_BASE_URL = 'https://jobseeker-capstone-705829099986.asia-southeast2.run.app';

export interface PortfolioProject {
  id?: string; // Optional: for existing records
  title: string;
  description?: string;
  projectUrl?: string;
  technologies?: string[]; // Array of technology names
  createdAt?: Date | FieldValue | string;
  updatedAt?: Date | FieldValue | string;
}

// Helper function to get the ID token
const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

// Add new portfolio project
export const addPortfolioProject = async (projectData: Omit<PortfolioProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<PortfolioProject> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/portfolio`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to add portfolio project and parse error' }));
    console.error('Add portfolio project error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to add portfolio project. Status: ${response.status}`);
  }
  const result = await response.json();
  return result.project as PortfolioProject; 
};

// Get all portfolio projects for the user
export const getPortfolioProjects = async (): Promise<PortfolioProject[]> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/portfolio`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to get portfolio projects and parse error' }));
    console.error('Get portfolio projects error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to get portfolio projects. Status: ${response.status}`);
  }
  const result = await response.json();
  return result.projects as PortfolioProject[];
};

// Update an existing portfolio project
export const updatePortfolioProject = async (id: string, projectData: Partial<Omit<PortfolioProject, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PortfolioProject> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }
  if (!id) {
    throw new Error('Project ID is required for update.');
  }
  
  const response = await fetch(`${API_BASE_URL}/portfolio/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to update portfolio project and parse error' }));
    console.error('Update portfolio project error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to update portfolio project. Status: ${response.status}`);
  }
  // The API for PATCH returns { message, updatedFields }. We might want to return the full updated project.
  // For now, let's assume we refetch or optimistically update.
  // To return the full project, the backend would need to send it.
  // For simplicity, we'll return a partial update and let the caller handle refetching or merging.
  const result = await response.json(); 
  // The backend for PATCH returns `updatedFields`, not the full project.
  // We'll return a merged object for optimistic updates, but refetching is safer.
  const updatedProject = { ...projectData, id } as PortfolioProject; // Create a semblence of the updated project
  return updatedProject; // Or just return result and handle in component
};

// Delete a portfolio project
export const deletePortfolioProject = async (id: string): Promise<{ message: string }> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }
  if (!id) {
    throw new Error('Project ID is required for deletion.');
  }

  const response = await fetch(`${API_BASE_URL}/portfolio/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to delete portfolio project and parse error' }));
    console.error('Delete portfolio project error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to delete portfolio project. Status: ${response.status}`);
  }
  return response.json();
};
