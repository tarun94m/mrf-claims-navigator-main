import { ClaimData, MRFFile } from '@/stores/MRFStore';

const API_BASE_URL = 'http://localhost:3001/api';

export const submitClaimsForMRF = async (claims: ClaimData[], customer: string): Promise<{ success: boolean; fileId: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-mrf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ claims, customer }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting claims:', error);
    throw error;
  }
};

export const fetchMRFFiles = async (): Promise<MRFFile[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/mrf-files`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching MRF files:', error);
    throw error;
  }
};

export const downloadMRFFile = async (fileId: string): Promise<Blob> => {
  try {
    const response = await fetch(`${API_BASE_URL}/download/${fileId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Error downloading MRF file:', error);
    throw error;
  }
};

export const getMRFFileDetails = async (fileId: string): Promise<MRFFile> => {
  try {
    const response = await fetch(`${API_BASE_URL}/file/${fileId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching file details:', error);
    throw error;
  }
};
