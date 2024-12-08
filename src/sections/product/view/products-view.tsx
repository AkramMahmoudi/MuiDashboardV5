// import { useState, useEffect, useCallback } from 'react';

// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Unstable_Grid2';
// import Pagination from '@mui/material/Pagination';
// import Typography from '@mui/material/Typography';

// import { DashboardContent } from 'src/layouts/dashboard';

// import { ProductItem } from '../product-item';
// import { ProductSort } from '../product-sort';
// import { CartIcon } from '../product-cart-widget';
// import { ProductFilters } from '../product-filters';

// import type { FiltersProps } from '../product-filters';

// // API Endpoint
// const API_URL = 'http://192.168.1.9:3000/api/products';

// // Filters and options
// const GENDER_OPTIONS = [
//   { value: 'men', label: 'Men' },
//   { value: 'women', label: 'Women' },
//   { value: 'kids', label: 'Kids' },
// ];

// const CATEGORY_OPTIONS = [
//   { value: 'all', label: 'All' },
//   { value: 'shose', label: 'Shose' },
//   { value: 'apparel', label: 'Apparel' },
//   { value: 'accessories', label: 'Accessories' },
// ];

// const RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

// const PRICE_OPTIONS = [
//   { value: 'below', label: 'Below $25' },
//   { value: 'between', label: 'Between $25 - $75' },
//   { value: 'above', label: 'Above $75' },
// ];

// const COLOR_OPTIONS = [
//   '#00AB55',
//   '#000000',
//   '#FFFFFF',
//   '#FFC0CB',
//   '#FF4842',
//   '#1890FF',
//   '#94D82D',
//   '#FFC107',
// ];

// const defaultFilters = {
//   price: '',
//   gender: [GENDER_OPTIONS[0].value],
//   colors: [COLOR_OPTIONS[4]],
//   rating: RATING_OPTIONS[0],
//   category: CATEGORY_OPTIONS[0].value,
// };

// interface Product {
//   id: number; // Ensure the type matches the data type, you mentioned it's a number
//   name: string;
//   sell_price: string;
//   quantity: number;
// }

// export function ProductsView() {
//   const [products, setProducts] = useState<Product[]>([]); // Using Product[] type here
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [sortBy, setSortBy] = useState('featured');
//   const [openFilter, setOpenFilter] = useState(false);
//   const [filters, setFilters] = useState<FiltersProps>(defaultFilters);

//   // Fetch data from the API
//   useEffect(() => {
//     const fetchProducts = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetch(`${API_URL}?page=${page}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch products');
//         }
//         const data = await response.json();

//         // Map data to match the required fields and update the products state
//         const filteredProducts: Product[] = data.data.map((product: any) => ({
//           id: product.id,
//           name: product.name,
//           sell_price: product.sell_price,
//           quantity: product.quantity,
//         }));

//         setProducts(filteredProducts); // Update with your API's response structure
//       } catch (err) {
//         setError((err as Error).message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [page]);

//   const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
//     setPage(value);
//   };

//   const handleOpenFilter = useCallback(() => {
//     setOpenFilter(true);
//   }, []);

//   const handleCloseFilter = useCallback(() => {
//     setOpenFilter(false);
//   }, []);

//   const handleSort = useCallback(
//     (newSort: string) => {
//       setSortBy(newSort);

//       // Sort the products based on the selected option
//       const sortedProducts = [...products];
//       if (newSort === 'priceAsc') {
//         sortedProducts.sort((a, b) => parseFloat(a.sell_price) - parseFloat(b.sell_price)); // Low to High
//       } else if (newSort === 'priceDesc') {
//         sortedProducts.sort((a, b) => parseFloat(b.sell_price) - parseFloat(a.sell_price)); // High to Low
//       }

//       setProducts(sortedProducts); // Update the products with the sorted data
//     },
//     [products]
//   );

//   const handleSetFilters = useCallback((updateState: Partial<FiltersProps>) => {
//     setFilters((prevValue) => ({ ...prevValue, ...updateState }));
//   }, []);

//   const canReset = Object.keys(filters).some(
//     (key) => filters[key as keyof FiltersProps] !== defaultFilters[key as keyof FiltersProps]
//   );

//   if (isLoading) {
//     return <Typography>Loading...</Typography>;
//   }

//   if (error) {
//     return <Typography>Error: {error}</Typography>;
//   }

//   return (
//     <DashboardContent>
//       <Typography variant="h4" sx={{ mb: 5 }}>
//         Products
//       </Typography>

//       <CartIcon totalItems={8} />

//       <Box
//         display="flex"
//         alignItems="center"
//         flexWrap="wrap-reverse"
//         justifyContent="flex-end"
//         sx={{ mb: 5 }}
//       >
//         <Box gap={1} display="flex" flexShrink={0} sx={{ my: 1 }}>
//           <ProductFilters
//             canReset={canReset}
//             filters={filters}
//             onSetFilters={handleSetFilters}
//             openFilter={openFilter}
//             onOpenFilter={handleOpenFilter}
//             onCloseFilter={handleCloseFilter}
//             onResetFilter={() => setFilters(defaultFilters)}
//             options={{
//               genders: GENDER_OPTIONS,
//               categories: CATEGORY_OPTIONS,
//               ratings: RATING_OPTIONS,
//               price: PRICE_OPTIONS,
//               colors: COLOR_OPTIONS,
//             }}
//           />

//           <ProductSort
//             sortBy={sortBy}
//             onSort={handleSort}
//             options={[
//               { value: 'priceAsc', label: 'Price: Low-High' },
//               { value: 'priceDesc', label: 'Price: High-Low' },
//             ]}
//           />
//         </Box>
//       </Box>

//       <Grid container spacing={3}>
//         {products.map((product) => (
//           <Grid key={product.id} xs={12} sm={6} md={3}>
//             <ProductItem product={product} />
//           </Grid>
//         ))}
//       </Grid>

//       <Pagination
//         count={10} // Replace with total pages from API response
//         page={page}
//         onChange={handlePageChange}
//         color="primary"
//         sx={{ mt: 8, mx: 'auto' }}
//       />
//     </DashboardContent>
//   );
// }
// new version with table instead cards
// import axios from 'axios';
// import React, { useState, useEffect } from 'react';

// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import Table from '@mui/material/Table';
// import Button from '@mui/material/Button';
// import TableBody from '@mui/material/TableBody';
// import Typography from '@mui/material/Typography';
// import TableContainer from '@mui/material/TableContainer';
// import TablePagination from '@mui/material/TablePagination';

// import { DashboardContent } from 'src/layouts/dashboard';

// import { Iconify } from 'src/components/iconify';
// import { Scrollbar } from 'src/components/scrollbar';

// import { TableNoData } from '../table-no-data';
// import { UserTableRow } from '../user-table-row';
// import { UserTableHead } from '../user-table-head';
// import { TableEmptyRows } from '../table-empty-rows';
// import { UserTableToolbar } from '../user-table-toolbar';
// import { emptyRows, emptyRowsv2, applyFilter, getComparator } from '../utils';

// // Define the structure of a user and the response
// interface User {
//   id: string;
//   name: string;
//   sell_price: number;
//   quantity: string;
//   barcode: string;
// }

// interface UserResponse {
//   data: User[];
//   current_page: number;
//   per_page: number;
//   total: number;
// }

// export function ProductsView() {
//   const [filterName, setFilterName] = useState(''); // Stores search query
//   const [users, setUsers] = useState<User[]>([]); // Stores the fetched product data
//   const [page, setPage] = useState(0); // Tracks the current page (0-indexed)
//   const [rowsPerPage, setRowsPerPage] = useState(10); // Number of rows per page
//   const [totalUsers, setTotalUsers] = useState(0); // Total number of products
//   const [selected, setSelected] = useState<string[]>([]); // Tracks selected rows

//   // Fetch users/products with optional search query and pagination
//   const fetchUsers = async (p = 1, query = '') => {
//     try {
//       const response = await axios.get<UserResponse>(
//         `http://192.168.1.9:3000/api/products?page=${p}&name=${query}`
//       );
//       const { data, per_page, total } = response.data;

//       setUsers(data);
//       setRowsPerPage(per_page);
//       setTotalUsers(total);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   // Fetch data when page changes or when filterName updates
//   useEffect(() => {
//     fetchUsers(page + 1, filterName); // Pass the current page and search query
//   }, [page, filterName]);

//   // Handle page change for pagination
//   const handlePageChange = (event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   // Handle search bar input and reset to the first page
//   const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setFilterName(event.target.value); // Update the search query
//     setPage(0); // Reset to the first page
//   };

//   // Handle row selection
//   const handleSelectRow = (id: string) => {
//     setSelected(
//       (prevSelected) =>
//         prevSelected.includes(id)
//           ? prevSelected.filter((selectedId) => selectedId !== id) // Deselect the row
//           : [...prevSelected, id] // Select the row
//     );
//   };

//   // Handle "Select All" functionality
//   const handleSelectAllRows = (checked: boolean) => {
//     if (checked) {
//       setSelected(users.map((user) => user.id)); // Select all users
//     } else {
//       setSelected([]); // Deselect all users
//     }
//   };

//   // Check if no results are found for the search query
//   const notFound = !users.length && !!filterName;

//   return (
//     <DashboardContent>
//       <Box display="flex" alignItems="center" mb={5}>
//         <Typography variant="h4" flexGrow={1}>
//           Products
//         </Typography>
//         <Button
//           variant="contained"
//           color="inherit"
//           startIcon={<Iconify icon="mingcute:add-line" />}
//         >
//           New Product
//         </Button>
//       </Box>

//       <Card>
//         <UserTableToolbar
//           numSelected={selected.length}
//           filterName={filterName}
//           onFilterName={handleSearch} // Update on input change
//         />

//         <Scrollbar>
//           <TableContainer sx={{ overflow: 'unset' }}>
//             <Table sx={{ minWidth: 800 }}>
//               <UserTableHead
//                 order="asc"
//                 orderBy="name"
//                 rowCount={users.length}
//                 numSelected={selected.length}
//                 onSort={() => {}}
//                 onSelectAllRows={handleSelectAllRows}
//                 headLabel={[
//                   { id: 'name', label: 'Name' },
//                   { id: 'sell_price', label: 'Price' },
//                   { id: 'quantity', label: 'Quantity' },
//                   { id: 'barcode', label: 'Barcode' },
//                   { id: '' },
//                 ]}
//               />

//               <TableBody>
//                 {users.map((row) => (
//                   <UserTableRow
//                     key={row.id}
//                     row={row}
//                     selected={selected.includes(row.id)}
//                     onSelectRow={() => handleSelectRow(row.id)}
//                   />
//                 ))}
//                 {/*
//                 {emptyRowsv2(page, rowsPerPage, totalUsers) > 0 && (
//                   <TableEmptyRows
//                     height={68}
//                     emptyRows={emptyRowsv2(page, rowsPerPage, totalUsers)}
//                   />
//                 )} */}

//                 {notFound && <TableNoData searchQuery={filterName} />}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Scrollbar>

//         <TablePagination
//           component="div"
//           page={page}
//           count={totalUsers}
//           rowsPerPage={rowsPerPage}
//           onPageChange={handlePageChange}
//           rowsPerPageOptions={[rowsPerPage]}
//         />
//       </Card>
//     </DashboardContent>
//   );
// }
// import axios from 'axios';
// import React, { useState, useEffect } from 'react';

// import {
//   Button,
//   Box,
//   Card,
//   Modal,
//   Table,
//   TextField,
//   TablePagination,
//   TableBody,
//   Typography,
//   TableContainer,
//   Stack,
// } from '@mui/material';

// import { DashboardContent } from 'src/layouts/dashboard';

// import { Iconify } from 'src/components/iconify';
// import { Scrollbar } from 'src/components/scrollbar';

// import { TableNoData } from '../table-no-data';
// import { UserTableRow } from '../user-table-row';
// import { UserTableHead } from '../user-table-head';
// import { TableEmptyRows } from '../table-empty-rows';
// import { UserTableToolbar } from '../user-table-toolbar';

// // Define the structure of a user and the response
// interface User {
//   id: string;
//   name: string;
//   sell_price: number;
//   quantity: string;
//   barcode: string;
// }

// interface UserResponse {
//   data: User[];
//   current_page: number;
//   per_page: number;
//   total: number;
// }

// export function ProductsView() {
//   const [filterName, setFilterName] = useState('');
//   const [users, setUsers] = useState<User[]>([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [selected, setSelected] = useState<string[]>([]);

//   // State for modal and form data
//   const [openModal, setOpenModal] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     barcode: '',
//     price: '',
//     sell_price: '',
//     quantity: '',
//   });

//   // Fetch users/products
//   const fetchUsers = async (p = 1, query = '') => {
//     try {
//       const response = await axios.get<UserResponse>(
//         `http://192.168.1.9:3000/api/products?page=${p}&name=${query}`
//       );
//       const { data, per_page, total } = response.data;

//       setUsers(data);
//       setRowsPerPage(per_page);
//       setTotalUsers(total);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   useEffect(() => {
//     fetchUsers(page + 1, filterName);
//   }, [page, filterName]);

//   const handlePageChange = (event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setFilterName(event.target.value);
//     setPage(0);
//   };

//   const handleSelectRow = (id: string) => {
//     setSelected((prevSelected) =>
//       prevSelected.includes(id)
//         ? prevSelected.filter((selectedId) => selectedId !== id)
//         : [...prevSelected, id]
//     );
//   };

//   const handleSelectAllRows = (checked: boolean) => {
//     if (checked) {
//       setSelected(users.map((user) => user.id));
//     } else {
//       setSelected([]);
//     }
//   };

//   const handleOpenModal = () => {
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setFormData({
//       name: '',
//       barcode: '',
//       price: '',
//       sell_price: '',
//       quantity: '',
//     });
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     try {
//       const payload = {
//         ...formData,
//         quantity: Number(formData.quantity), // Ensure quantity is a number
//       };

//       await axios.post('http://192.168.1.9:3000/api/product', payload);
//       handleCloseModal();
//       fetchUsers(page + 1, filterName); // Refresh table data
//     } catch (error) {
//       console.error('Error adding product:', error);
//     }
//   };

//   const notFound = !users.length && !!filterName;

//   return (
//     <DashboardContent>
//       <Box display="flex" alignItems="center" mb={5}>
//         <Typography variant="h4" flexGrow={1}>
//           Products
//         </Typography>
//         <Button
//           variant="contained"
//           color="inherit"
//           startIcon={<Iconify icon="mingcute:add-line" />}
//           onClick={handleOpenModal}
//         >
//           New Product
//         </Button>
//       </Box>

//       <Card>
//         <UserTableToolbar
//           numSelected={selected.length}
//           filterName={filterName}
//           onFilterName={handleSearch}
//         />

//         <Scrollbar>
//           <TableContainer sx={{ overflow: 'unset' }}>
//             <Table sx={{ minWidth: 800 }}>
//               <UserTableHead
//                 order="asc"
//                 orderBy="name"
//                 rowCount={users.length}
//                 numSelected={selected.length}
//                 onSort={() => {}}
//                 onSelectAllRows={handleSelectAllRows}
//                 headLabel={[
//                   { id: 'name', label: 'Name' },
//                   { id: 'sell_price', label: 'Price' },
//                   { id: 'quantity', label: 'Quantity' },
//                   { id: 'barcode', label: 'Barcode' },
//                   { id: '' },
//                 ]}
//               />

//               <TableBody>
//                 {users.map((row) => (
//                   <UserTableRow
//                     key={row.id}
//                     row={row}
//                     selected={selected.includes(row.id)}
//                     onSelectRow={() => handleSelectRow(row.id)}
//                   />
//                 ))}
//                 {notFound && <TableNoData searchQuery={filterName} />}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Scrollbar>

//         <TablePagination
//           component="div"
//           page={page}
//           count={totalUsers}
//           rowsPerPage={rowsPerPage}
//           onPageChange={handlePageChange}
//           rowsPerPageOptions={[rowsPerPage]}
//         />
//       </Card>

//       {/* Modal for Adding Product */}
//       <Modal open={openModal} onClose={handleCloseModal}>
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             width: 400,
//             bgcolor: 'background.paper',
//             p: 4,
//             borderRadius: 2,
//             boxShadow: 24,
//           }}
//         >
//           <Typography variant="h6" mb={2}>
//             Add New Product
//           </Typography>
//           <Stack spacing={2}>
//             <TextField
//               label="Name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               fullWidth
//             />
//             <TextField
//               label="Barcode"
//               name="barcode"
//               value={formData.barcode}
//               onChange={handleChange}
//               fullWidth
//             />
//             <TextField
//               label="Price"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               fullWidth
//             />
//             <TextField
//               label="Sell Price"
//               name="sell_price"
//               value={formData.sell_price}
//               onChange={handleChange}
//               fullWidth
//             />
//             <TextField
//               label="Quantity"
//               name="quantity"
//               value={formData.quantity}
//               type="number"
//               onChange={handleChange}
//               fullWidth
//             />
//           </Stack>
//           <Stack direction="row" spacing={2} mt={3}>
//             <Button variant="contained" onClick={handleSubmit}>
//               Submit
//             </Button>
//             <Button variant="outlined" onClick={handleCloseModal}>
//               Cancel
//             </Button>
//           </Stack>
//         </Box>
//       </Modal>
//     </DashboardContent>
//   );
// }
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
  sell_price: number;
  quantity: number;
  barcode: number;
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

  // State for modal
  const [openModal, setOpenModal] = useState(false);

  // Input refs
  const nameRef = useRef<HTMLInputElement>(null);
  const barcodeRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const sellPriceRef = useRef<HTMLInputElement>(null);
  const quantityRef = useRef<HTMLInputElement>(null);

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

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    // Clear input values
    if (nameRef.current) nameRef.current.value = '';
    if (barcodeRef.current) barcodeRef.current.value = '';
    if (priceRef.current) priceRef.current.value = '';
    if (sellPriceRef.current) sellPriceRef.current.value = '';
    if (quantityRef.current) quantityRef.current.value = '';
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: nameRef.current?.value,
        barcode: barcodeRef.current?.value,
        price: Number(priceRef.current?.value),
        sell_price: Number(sellPriceRef.current?.value),
        quantity: Number(quantityRef.current?.value),
      };

      await axios.post('http://192.168.1.9:3000/api/product', payload);
      handleCloseModal();
      fetchUsers(page + 1, filterName); // Refresh table data
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const notFound = !users.length && !!filterName;

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
          onClick={handleOpenModal}
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
                  { id: 'barcode', label: 'Barcode' },
                  { id: '' },
                ]}
              />

              <TableBody>
                {users.map((row) => (
                  <UserTableRow
                    key={row.id}
                    row={row}
                    selected={selected.includes(row.id)}
                    onSelectRow={() => handleSelectRow(row.id)}
                  />
                ))}
                {notFound && <TableNoData searchQuery={filterName} />}
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
            Add New Product
          </Typography>
          <Stack spacing={2}>
            <TextField label="Name" inputRef={nameRef} fullWidth />
            <TextField label="Barcode" inputRef={barcodeRef} fullWidth />
            <TextField label="Price" inputRef={priceRef} fullWidth />
            <TextField label="Sell Price" inputRef={sellPriceRef} fullWidth />
            <TextField label="Quantity" type="number" inputRef={quantityRef} fullWidth />
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
