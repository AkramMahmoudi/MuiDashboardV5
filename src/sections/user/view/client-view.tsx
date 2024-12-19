import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react';

import {
  Button,
  Box,
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

import { fetchData, handleConfirmDelete } from '../../apiService';
import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';

import { emptyRows, emptyRowsv2, applyFilter, getComparator } from '../utils';

// Define the structure of a user and the response

interface User {
  id: string;
  name: string;
  phone: string;
  montant: number;
  ancien: number;
}

// interface FetchResponse {
//   data: User[];
//   current_page: number;
//   per_page: number;
//   total: number;
// }

export function ClientView() {
  const [filterName, setFilterName] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [formData, setFormData] = useState<User>({
    id: '',
    name: '',
    phone: '',
    montant: 0,
    ancien: 0,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const [loading, setLoading] = useState(false);

  // State for modal
  const [openModal, setOpenModal] = useState(false);
  const [editProduct, setEditProduct] = useState<User | null>(null); // State for editing product

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const fetchUsers = async (p: number, fName: string) => {
    try {
      const params = { page: p, name: fName };
      const { data, per_page, total } = await fetchData<User>(
        `${import.meta.env.VITE_API_BASE_URL}/api/clients`,
        params
      );

      setUsers(data);
      setRowsPerPage(per_page);
      setTotalUsers(total);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers(page + 1, filterName);
  }, [page, filterName]);

  const handleOpenConfirmDialog = (id: string) => {
    setProductToDelete(id);
    setConfirmDialogOpen(true);
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

  const handleSelectRow = (id: string) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAllRows = (checked: boolean) => {
    if (checked) {
      setSelected(users.map((user) => user.id));
    } else {
      setSelected([]);
    }
  };

  const handleOpenModal = (product: User | null = null) => {
    if (product) {
      setFormData(product); // Set form data for editing
    } else {
      setFormData({
        id: '',
        name: '',
        phone: '',
        montant: 0,
        ancien: 0,
      }); // Reset form for adding
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Convert string fields to numbers for the payload
      const { id, name, phone, montant, ancien } = formData;

      const payload = {
        name,
        phone,
        montant: Number(montant),
        ancien: Number(ancien),
      };

      const url = id
        ? `http://192.168.1.9:3000/api/client/${id}`
        : 'http://192.168.1.9:3000/api/client';
      const method = id ? 'put' : 'post';

      await axios({
        method,
        url,
        data: payload,
      });
      setSnackbarMessage(id ? 'Product updated successfully!' : 'Product added successfully!');
      setSnackbarSeverity('success');

      handleCloseModal();
      fetchUsers(page + 1, filterName);
    } catch (error: any) {
      // console.error('Error saving product:', error);
      setSnackbarMessage(error.response?.data);
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
      setSnackbarOpen(true); // Show the snackbar
    }
  };

  // const handleEditProduct = (product: User) => {
  //   setRowBeingEdited(product); // Set the product being edited
  //   setOpenModal(true);
  // };

  // const notFound = !users.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Clients
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => handleOpenModal()}
        >
          New Client
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleSearch}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order="asc"
                orderBy="name"
                rowCount={users.length}
                numSelected={selected.length}
                onSort={() => {}}
                onSelectAllRows={handleSelectAllRows}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'phone', label: 'phone' },
                  { id: 'montant', label: 'montant' },
                  { id: 'ancien', label: 'ancien' },
                  { id: '', label: '' },
                ]}
              />

              <TableBody>
                {users.map((row) => (
                  <UserTableRow
                    key={row.id}
                    row={row}
                    selected={selected.includes(row.id)}
                    onSelectRow={() => handleSelectRow(row.id)}
                    onEdit={() => handleOpenModal(row)}
                    onDelete={() => handleOpenConfirmDialog(row.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={page}
          count={totalUsers}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          rowsPerPageOptions={[rowsPerPage]}
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
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} variant="outlined">
            Cancel
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
                apiEndpoint: `${import.meta.env.VITE_API_BASE_URL}/api/client`,
                closeDialog: handleCloseConfirmDialog,
              })
            }
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for Adding Product */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" mb={2}>
            {formData.id ? 'Edit Client' : 'Add New Client'}
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="montant"
              name="montant"
              value={formData.montant}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="ancien"
              name="ancien"
              value={formData.ancien}
              onChange={handleChange}
              fullWidth
              // inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
          </Stack>
          <Stack direction="row" spacing={2} mt={3}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
    </DashboardContent>
  );
}
