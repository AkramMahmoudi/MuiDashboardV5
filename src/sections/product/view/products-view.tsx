import axios from 'axios';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs'; // Optional for formatting dates
import { useTranslation } from 'react-i18next';

import {
  Box,
  Button,
  Card,
  Modal,
  Table,
  TextField,
  TablePagination,
  TableBody,
  Typography,
  TableContainer,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { UserTableToolbar } from '../user-table-toolbar';
import { fetchData, handleConfirmDelete } from '../../apiService';
import { ProductModal } from './ProductModal';
import { ProductTable } from './ProductTable';
// Define the structure of a user and the response

interface User {
  id?: string;
  name: string;
  price: number;
  sell_price: number;
  quantity: number;
  category_id: number;
  image: File | null;
  barcode: { name: string }[];
}

type Category = {
  id: number;
  name: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  user_id: number | null;
};
type ApiResponse<T> = {
  data: T;
  total: number;
  total_pages: number;
  per_page: number;
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
};

export function ProductsView() {
  const { t, i18n } = useTranslation(); // Hook for translations

  const [filterName, setFilterName] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [formData, setFormData] = useState<User | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const [loading, setLoading] = useState(false);

  // State for modal
  const [openModal, setOpenModal] = useState(false);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  // category states
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | 'All'>('All');

  const [selectedItems, setSelectedItems] = useState<number[]>([]); // assuming selectedItems is an array of numbers

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetchData<Category>(
        `${import.meta.env.VITE_API_BASE_URL}/api/categories`,
        {}
      );
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  // Fetch Data
  const fetchUsers = useCallback(
    async (p: number, fName: string) => {
      try {
        const isBarcode = /^\d+$/.test(fName);
        const params = {
          page: p,
          name: !isBarcode ? fName : undefined,
          barcode: isBarcode ? fName : undefined,
          category_id: selectedCategory !== 'All' ? selectedCategory : undefined,
          from: startDate ? dayjs(startDate).format('YYYY-MM-DD') : undefined,
          to: endDate ? dayjs(endDate).format('YYYY-MM-DD') : undefined,
        };

        const { data, per_page, total } = await fetchData<User>(
          `${import.meta.env.VITE_API_BASE_URL}/api/FilterProducts`,
          params
        );

        setUsers(data);
        setRowsPerPage(per_page);
        setTotalUsers(total);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    [selectedCategory, startDate, endDate]
  );

  useEffect(() => {
    fetchUsers(page + 1, filterName);
  }, [page, filterName, fetchUsers]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenConfirmDialog = (id: string) => {
    setProductToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleSelectItem = (itemId: number) => {
    setSelectedItems(
      (prevSelectedItems) =>
        prevSelectedItems.includes(itemId)
          ? prevSelectedItems.filter((id) => id !== itemId) // Remove item if already selected
          : [...prevSelectedItems, itemId] // Add item to selection
    );
  };

  const handleCloseConfirmDialog = () => {
    setProductToDelete(null);
    setConfirmDialogOpen(false);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
    setPage(0);
  };

  const handleOpenModal = (product: User | null = null) => {
    if (product) {
      // console.log(product);
      setFormData(product);
    } else {
      setFormData({
        id: '',
        name: '',
        price: 0,
        sell_price: 0,
        quantity: 0,
        category_id: 0,
        image: null,
        barcode: [],
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // const notFound = !users.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          {t('products.title')}
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => handleOpenModal()}
        >
          {t('products.new_product')}
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={selectedItems.length}
          filterName={filterName}
          onFilterName={handleSearch}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={(e) => {
            const value = e.target.value === 'All' ? 'All' : Number(e.target.value);
            setSelectedCategory(value);
            setPage(0);
            fetchUsers(1, filterName);
          }}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={(date) => setStartDate(date)}
          onEndDateChange={(date) => setEndDate(date)}
        />

        <Scrollbar>
          <ProductTable
            users={users}
            page={page}
            rowsPerPage={rowsPerPage}
            totalUsers={totalUsers}
            onEdit={handleOpenModal}
            onDelete={handleOpenConfirmDialog}
            onPageChange={setPage}
            onSelectItem={handleSelectItem} // Pass handleSelectItem to ProductTable
          />
        </Scrollbar>

        <TablePagination
          component="div"
          page={page}
          count={totalUsers}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          rowsPerPageOptions={[rowsPerPage]}
          labelRowsPerPage={t('pagination.rowsPerPage')} // Translating "Rows per page"
          labelDisplayedRows={
            ({ from, to, count }) => t('pagination.displayedRows', { from, to, count }) // Translating "1–10 of 100"
          }
        />
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
        <DialogTitle>{t('products.confirm_delete')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('products.delete_warning')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} variant="outlined">
            {t('products.cancel')}
          </Button>

          <Button
            onClick={() =>
              handleConfirmDelete({
                idToDelete: productToDelete,
                setSnackbarMessage,
                setSnackbarSeverity,
                setSnackbarOpen,
                setLoading,
                fetchFunction: () => {
                  fetchUsers(page + 1, filterName);
                },
                apiEndpoint: `${import.meta.env.VITE_API_BASE_URL}/api/product`,
                closeDialog: handleCloseConfirmDialog,
              })
            }
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? t('products.deleting') : t('products.delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for Adding Product */}
      <ProductModal
        open={openModal}
        onClose={handleCloseModal}
        formData={formData}
        setFormData={setFormData}
        fetchUsers={() => fetchUsers(page + 1, filterName)}
        setSnackbarMessage={setSnackbarMessage}
        setSnackbarSeverity={setSnackbarSeverity}
        setSnackbarOpen={setSnackbarOpen}
      />
    </DashboardContent>
  );
}
