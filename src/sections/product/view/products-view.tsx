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
  const [rowBeingEdited, setRowBeingEdited] = useState<User | null>(null);

  // State for modal
  const [openModal, setOpenModal] = useState(false);
  const [editProduct, setEditProduct] = useState<User | null>(null); // State for editing product

  // Input refs
  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const sellPriceRef = useRef<HTMLInputElement>(null);
  const quantityRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);

  // Fetch users/products
  const fetchUsers = async (p = 1, query = '') => {
    try {
      const response = await axios.get<UserResponse>(
        `http://192.168.1.9:3000/api/products?page=${p}&name=${query}`
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
      // فتح للتعديل
      if (nameRef.current) nameRef.current.value = product.name;
      if (priceRef.current) priceRef.current.value = product.price.toString();
      if (sellPriceRef.current) sellPriceRef.current.value = product.sell_price.toString();
      if (quantityRef.current) quantityRef.current.value = product.quantity.toString();
      if (categoryRef.current) categoryRef.current.value = product.category_id.toString();
      setRowBeingEdited(product);
    } else {
      // فتح للإضافة
      if (nameRef.current) nameRef.current.value = '';
      if (priceRef.current) priceRef.current.value = '';
      if (sellPriceRef.current) sellPriceRef.current.value = '';
      if (quantityRef.current) quantityRef.current.value = '';
      if (categoryRef.current) categoryRef.current.value = '';
      setRowBeingEdited(null);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    if (nameRef.current) nameRef.current.value = '';
    if (priceRef.current) priceRef.current.value = '';
    if (sellPriceRef.current) sellPriceRef.current.value = '';
    if (quantityRef.current) quantityRef.current.value = '';
    if (categoryRef.current) categoryRef.current.value = '';
    setRowBeingEdited(null);
    setOpenModal(false);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: nameRef.current?.value || '',
        price: parseFloat(priceRef.current?.value || '0'),
        sell_price: parseFloat(sellPriceRef.current?.value || '0'),
        quantity: parseInt(quantityRef.current?.value || '0', 10),
        category_id: parseInt(categoryRef.current?.value || '0', 10),
      };

      const url = rowBeingEdited
        ? `http://192.168.1.9:3000/api/product/${rowBeingEdited.id}`
        : 'http://192.168.1.9:3000/api/product';

      const method = rowBeingEdited ? 'put' : 'post';

      await axios({ method, url, data: payload });
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
            {rowBeingEdited ? 'Edit Product' : 'Add New Product'}
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Name"
              inputRef={nameRef}
              value={rowBeingEdited?.name || ''}
              onChange={(e) =>
                setRowBeingEdited((prev) => (prev ? { ...prev, name: e.target.value } : null))
              }
              fullWidth
            />

            <TextField
              label="Price"
              inputRef={priceRef}
              value={rowBeingEdited?.price || ''}
              onChange={(e) =>
                setRowBeingEdited((prev) =>
                  prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : null
                )
              }
              fullWidth
            />
            <TextField
              label="Sell Price"
              inputRef={sellPriceRef}
              value={rowBeingEdited?.sell_price || ''}
              onChange={(e) =>
                setRowBeingEdited((prev) =>
                  prev ? { ...prev, sell_price: parseFloat(e.target.value) || 0 } : null
                )
              }
              fullWidth
            />
            <TextField
              label="Quantity"
              type="number"
              inputRef={quantityRef}
              value={rowBeingEdited?.quantity || ''}
              onChange={(e) =>
                setRowBeingEdited((prev) =>
                  prev ? { ...prev, quantity: parseInt(e.target.value, 10) || 0 } : null
                )
              }
              fullWidth
            />
            <TextField
              label="Category ID"
              type="number"
              inputRef={categoryRef}
              value={rowBeingEdited?.category_id || ''}
              onChange={(e) =>
                setRowBeingEdited((prev) =>
                  prev ? { ...prev, category_id: parseInt(e.target.value, 10) || 0 } : null
                )
              }
              fullWidth
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
