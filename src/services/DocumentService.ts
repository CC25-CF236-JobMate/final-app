// src/services/documentService.ts
import { auth } from '../services/firebase'; // Your Firebase auth instance
import { FieldValue } from "firebase/firestore"; // Firestore type

const API_BASE_URL = 'https://jobseeker-capstone-705829099986.asia-southeast2.run.app';

export interface DocumentData {
  id?: string; // Optional: for existing records
  documentName: string;
  type: 'CV' | 'Sertifikat' | 'Lainnya' | string; // Predefined types + string for flexibility
  fileUrl: string;
  base64String?: string; // Only for upload/update, not typically stored long-term in this interface
  uploadedAt?: Date | FieldValue | string;
  updatedAt?: Date | FieldValue | string;
}

export const documentTypes: ReadonlyArray<DocumentData['type']> = ['CV', 'Sertifikat', 'Lainnya'];

// Helper function to get the ID token
const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

// Add new document
export const addDocument = async (
  documentName: string, 
  type: DocumentData['type'], 
  base64String: string
): Promise<{ documentId: string, fileUrl: string, documentName: string }> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/upload-document`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ documentName, type, file: base64String }), // API expects 'file' for base64String
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to upload document and parse error' }));
    console.error('Add document error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to upload document. Status: ${response.status}`);
  }
  return response.json(); 
};

// Get all documents for the user
export const getDocuments = async (): Promise<DocumentData[]> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/upload-document`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to get documents and parse error' }));
    console.error('Get documents error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to get documents. Status: ${response.status}`);
  }
  const result = await response.json();
  return result.documents as DocumentData[];
};

// Update an existing document
export const updateDocument = async (
  documentId: string, 
  documentName?: string,
  type?: DocumentData['type'], 
  base64String?: string // Optional: only if file is being replaced
): Promise<{ documentId: string, fileUrl?: string, documentName?: string, type?: string }> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }
  if (!documentId) {
    throw new Error('Document ID is required for update.');
  }
  
  const payload: { documentName?: string, type?: DocumentData['type'], base64String?: string } = {};
  if (documentName) payload.documentName = documentName;
  if (type) payload.type = type;
  if (base64String) payload.base64String = base64String;


  if (Object.keys(payload).length === 0) {
    throw new Error("No fields provided for update.");
  }

  const response = await fetch(`${API_BASE_URL}/upload-document/${documentId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to update document and parse error' }));
    console.error('Update document error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to update document. Status: ${response.status}`);
  }
  return response.json();
};

// Delete a document
export const deleteDocument = async (documentId: string): Promise<{ message: string }> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }
  if (!documentId) {
    throw new Error('Document ID is required for deletion.');
  }

  const response = await fetch(`${API_BASE_URL}/upload-document/${documentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to delete document and parse error' }));
    console.error('Delete document error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to delete document. Status: ${response.status}`);
  }
  return response.json();
};
