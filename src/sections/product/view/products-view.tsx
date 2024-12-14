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
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

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
  price: number;
  sell_price: number;
  quantity: number;
  category_id: number; // إضافة category_id
}
interface UserResponse {
  data: User[];
  current_page: number;
  per_page: number;
  total: number;
}

export function ProductsView() {
  const [filterName, setFilterName] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [formData, setFormData] = useState<User>({
    id: '',
    name: '',
    price: 0,
    sell_price: 0,
    quantity: 0,
    category_id: 0,
  });

  // State for modal
  const [openModal, setOpenModal] = useState(false);
  const [editProduct, setEditProduct] = useState<User | null>(null); // State for editing product

  // Fetch users/products
  const fetchUsers = async (p = 1, query = '') => {
    try {
      const response = await axios.get<UserResponse>(
        `http://192.168.1.3:3000/api/products?page=${p}&name=${query}`
      );
      const { data, per_page, total } = response.data;

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

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://192.168.1.3:3000/api/product/${id}`);
      fetchUsers(page + 1, filterName); // Refresh the product list after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
    }
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
        price: 0,
        sell_price: 0,
        quantity: 0,
        category_id: 0,
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
      [name]:
        name === 'price' || name === 'sell_price' || name === 'quantity' || name === 'category_id'
          ? value // Keep as a string to allow intermediate values like "0"
          : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Convert string fields to numbers for the payload
      const { id, name, price, sell_price, quantity, category_id } = formData;

      const payload = {
        name,
        price: Number(price),
        sell_price: Number(sell_price),
        quantity: Number(quantity),
        category_id: Number(category_id),
      };

      const url = id
        ? `http://192.168.1.3:3000/api/product/${id}`
        : 'http://192.168.1.3:3000/api/product';
      const method = id ? 'put' : 'post';

      await axios({
        method,
        url,
        data: payload,
      });

      handleCloseModal();
      fetchUsers(page + 1, filterName);
    } catch (error) {
      console.error('Error saving product:', error);
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
          Products
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => handleOpenModal()}
        >
          New Product
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
                  { id: 'sell_price', label: 'Price' },
                  { id: 'quantity', label: 'Quantity' },
                  { id: 'category_id', label: 'category' },
                  { id: '', label: '' },
                ]}
              />

              <TableBody>
                {users.map((row) => (
                  <UserTableRow
                    key={row.id}
                    row={row}
                    selected={selected.includes(row.id)}
                    onSelectRow={() => {}}
                    onEdit={() => handleOpenModal(row)}
                    onDelete={() => handleDelete(row.id)}
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
            {formData.id ? 'Edit Product' : 'Add New Product'}
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
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
            <TextField
              label="Sell Price"
              name="sell_price"
              type="number"
              value={formData.sell_price}
              onChange={handleChange}
              fullWidth
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              fullWidth
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
            <TextField
              label="Category ID"
              name="category_id"
              type="number"
              value={formData.category_id}
              onChange={handleChange}
              fullWidth
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
          </Stack>
          <Stack direction="row" spacing={2} mt={3}>
            <Button variant="contained" onClick={handleSubmit}>
              Submit
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
