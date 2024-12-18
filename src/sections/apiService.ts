import type { Dispatch, SetStateAction } from 'react';

import axios from 'axios';

interface FetchResponse<T> {
  data: T[];
  per_page: number;
  total: number;
}

// Reusable fetch function
export const fetchData = async <T>(
  url: string,
  page: number = 1,
  filter: string = ''
): Promise<FetchResponse<T>> => {
  try {
    const response = await axios.get<FetchResponse<T>>(
      `${url}?page=${page}&name=${filter}`
    );
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

