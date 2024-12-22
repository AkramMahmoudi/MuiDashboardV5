import type { Dispatch, SetStateAction } from 'react';

import axios from 'axios';

interface FetchResponse<T> {
  data: T[];
  per_page: number;
  total: number;
}
interface PostResponse {
  token: string;
  [key: string]: any; // If the response may have additional properties
}
// Reusable fetch function
export const fetchData = async <T>(
  url: string,
  params: Record<string, any>
): Promise<FetchResponse<T>> => {
  try {
    const response = await axios.get<FetchResponse<T>>(url, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// deleteHandler.ts

interface DeleteHandlerParams {
  idToDelete: string | null;
  setSnackbarMessage: Dispatch<SetStateAction<string>>;
  setSnackbarSeverity: Dispatch<SetStateAction<'success' | 'error'>>;
  setSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  fetchFunction: () => void; // Function to refresh data after deletion
  apiEndpoint: string; // Base URL for deletion
  closeDialog: () => void; // Function to close the confirmation dialog
}

export const handleConfirmDelete = async ({
  idToDelete,
  setSnackbarMessage,
  setSnackbarSeverity,
  setSnackbarOpen,
  setLoading,
  fetchFunction,
  apiEndpoint,
  closeDialog,
}: DeleteHandlerParams) => {
  if (!idToDelete) return;

  try {
    setLoading(true);
    const response = await axios.delete(`${apiEndpoint}/${idToDelete}`);
    setSnackbarMessage(response.data as string);
    setSnackbarSeverity('success');
    fetchFunction(); // Refresh data after deletion
  } catch (error: any) {
    setSnackbarMessage(error.response?.data?.message || 'Failed to delete item.');
    setSnackbarSeverity('error');
  } finally {
    setLoading(false);
    setSnackbarOpen(true);
    closeDialog();
  }
};

export const postData = async (
  resource: string,
  params: Record<string, any>
): Promise<PostResponse> => {
  try {
    const response = await axios.post<PostResponse>(
      `${import.meta.env.VITE_API_BASE_URL}/api/${resource}`,
      params
    );
    if (response.status === 200) {
      const TOKEN = response.data.token;
      localStorage.setItem('token', TOKEN);

      axios.defaults.headers.common.Authorization = `Bearer ${TOKEN}`;
    }

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
