// import axios from 'axios';
// import React, { useRef, useState, useEffect, useCallback } from 'react';

// import {
//   Box,
//   Button,
//   Card,
//   Modal,
//   Table,
//   TextField,
//   TablePagination,
//   TableBody,
//   Typography,
//   TableContainer,
//   Stack,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from '@mui/material';

// import { DashboardContent } from 'src/layouts/dashboard';
// import { Iconify } from 'src/components/iconify';
// import { Scrollbar } from 'src/components/scrollbar';

// import { TableNoData } from '../table-no-data';
// import { UserTableRow } from '../user-table-row';
// import { UserTableHead } from '../user-table-head';
// import { TableEmptyRows } from '../table-empty-rows';
// import { UserTableToolbar } from '../user-table-toolbar';
// import { fetchData, handleConfirmDelete } from '../../apiService';
// import { emptyRows, emptyRowsv2, applyFilter, getComparator } from '../utils';

// // Define the structure of a user and the response

// interface User {
//   id: string;
//   name: string;
//   price: number;
//   sell_price: number;
//   quantity: number;
//   category_id: number; // إضافة category_id
// }

// type Category = {
//   id: number;
//   name: string;
//   deleted_at: string | null;
//   created_at: string;
//   updated_at: string;
//   user_id: number | null;
// };
// type ApiResponse<T> = {
//   data: T;
//   total: number;
//   total_pages: number;
//   per_page: number;
//   current_page: number;
//   next_page: number | null;
//   prev_page: number | null;
// };

// export function ProductsView() {
//   const [filterName, setFilterName] = useState('');
//   const [users, setUsers] = useState<User[]>([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [selected, setSelected] = useState<string[]>([]);
//   const [formData, setFormData] = useState<User>({
//     id: '',
//     name: '',
//     price: 0,
//     sell_price: 0,
//     quantity: 0,
//     category_id: 0,
//   });
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

//   const [loading, setLoading] = useState(false);

//   // State for modal
//   const [openModal, setOpenModal] = useState(false);
//   const [editProduct, setEditProduct] = useState<User | null>(null); // State for editing product

//   const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
//   const [productToDelete, setProductToDelete] = useState<string | null>(null);
//   // category states
//   const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<number | 'All'>('All');

//   const fetchCategories = async () => {
//     try {
//       // Retrieve the JWT token from localStorage (or other secure storage if used)
//       // const token = localStorage.getItem('jwtToken');
//       // if (!token) {
//       //   console.error('JWT token not found. Please log in.');
//       //   setCategories([]); // Set to an empty array if the token is missing
//       //   return;
//       // }
//       // Make the API request with the Authorization header
//       const response = await axios.get<ApiResponse<Category[]>>(
//         `${import.meta.env.VITE_API_BASE_URL}/api/Filtercategories`
//       );

//       console.log('Fetched categories:', response.data);
//       setCategories(response.data.data); // ضبط القيم في الحالة
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//       // setCategories([]);
//     }
//   };

//   // Fetch users/products
//   const fetchUsers = useCallback(
//     async (p: number, fName: string) => {
//       try {
//         // تحديد إذا كان الإدخال رقمًا أو نصًا
//         const isBarcode = /^\d+$/.test(fName); // يتحقق إذا كان fName يتكون فقط من أرقام
//         const name = isBarcode ? '' : fName;
//         const barcode = isBarcode ? fName : '';
//         const params = {
//           page: p,
//           name: name || undefined, // Include only if name is not empty
//           barcode: barcode || undefined, // Include only if barcode is not empty
//           category_id: selectedCategory !== 'All' ? selectedCategory : undefined, // Include only if category is selected
//         };

//         // Fetch data
//         const { data, per_page, total } = await fetchData<User>(
//           `${import.meta.env.VITE_API_BASE_URL}/api/products`,
//           params
//         );

//         setUsers(data);
//         setRowsPerPage(per_page);
//         setTotalUsers(total);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     },
//     [selectedCategory]
//   );

//   useEffect(() => {
//     fetchUsers(page + 1, filterName);
//   }, [page, filterName, fetchUsers]);

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const handleOpenConfirmDialog = (id: string) => {
//     setProductToDelete(id);
//     setConfirmDialogOpen(true);
//   };

//   const handleCloseConfirmDialog = () => {
//     setProductToDelete(null);
//     setConfirmDialogOpen(false);
//   };
//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

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

//   const handleOpenModal = (product: User | null = null) => {
//     if (product) {
//       setFormData(product); // Set form data for editing
//     } else {
//       setFormData({
//         id: '',
//         name: '',
//         price: 0,
//         sell_price: 0,
//         quantity: 0,
//         category_id: 0,
//       }); // Reset form for adding
//     }
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         name === 'price' || name === 'sell_price' || name === 'quantity' || name === 'category_id'
//           ? value // Keep as a string to allow intermediate values like "0"
//           : value,
//     }));
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       // Convert string fields to numbers for the payload
//       const { id, name, price, sell_price, quantity, category_id } = formData;

//       const payload = {
//         name,
//         price: Number(price),
//         sell_price: Number(sell_price),
//         quantity: Number(quantity),
//         category_id: Number(category_id),
//       };

//       const url = id
//         ? `http://192.168.1.9:3000/api/product/${id}`
//         : 'http://192.168.1.9:3000/api/product';
//       const method = id ? 'put' : 'post';

//       await axios({
//         method,
//         url,
//         data: payload,
//       });
//       setSnackbarMessage(id ? 'Product updated successfully!' : 'Product added successfully!');
//       setSnackbarSeverity('success');

//       handleCloseModal();
//       fetchUsers(page + 1, filterName);
//     } catch (error: any) {
//       // console.error('Error saving product:', error);
//       setSnackbarMessage(error.response?.data);
//       setSnackbarSeverity('error');
//     } finally {
//       setLoading(false);
//       setSnackbarOpen(true); // Show the snackbar
//     }
//   };

//   // const notFound = !users.length && !!filterName;

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
//           onClick={() => handleOpenModal()}
//         >
//           New Product
//         </Button>
//       </Box>

//       <Card>
//         <UserTableToolbar
//           numSelected={selected.length}
//           filterName={filterName}
//           onFilterName={handleSearch}
//           categories={categories}
//           selectedCategory={selectedCategory}
//           onCategoryChange={(e) => {
//             const value = e.target.value === 'All' ? 'All' : Number(e.target.value);
//             setSelectedCategory(value);
//             setPage(0);
//             fetchUsers(1, filterName);
//           }}
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
//                   { id: 'category_id', label: 'category' },
//                   { id: '', label: '' },
//                 ]}
//               />

//               <TableBody>
//                 {users.map((row) => (
//                   <UserTableRow
//                     key={row.id}
//                     row={row}
//                     selected={selected.includes(row.id)}
//                     onSelectRow={() => handleSelectRow(row.id)}
//                     onEdit={() => handleOpenModal(row)}
//                     onDelete={() => handleOpenConfirmDialog(row.id)}
//                   />
//                 ))}
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
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={3000}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//       >
//         <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//       {/* Confirmation Dialog */}
//       <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete this product? This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseConfirmDialog} variant="outlined">
//             Cancel
//           </Button>

//           <Button
//             onClick={() =>
//               handleConfirmDelete({
//                 idToDelete: productToDelete,
//                 setSnackbarMessage,
//                 setSnackbarSeverity,
//                 setSnackbarOpen,
//                 setLoading,
//                 fetchFunction: () => {
//                   fetchUsers(page + 1, filterName);
//                 },
//                 apiEndpoint: `${import.meta.env.VITE_API_BASE_URL}/api/product`,
//                 closeDialog: handleCloseConfirmDialog,
//               })
//             }
//             variant="contained"
//             color="error"
//             disabled={loading}
//             startIcon={loading && <CircularProgress size={20} />}
//           >
//             {loading ? 'Deleting...' : 'Delete'}
//           </Button>
//         </DialogActions>
//       </Dialog>

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
//             {formData.id ? 'Edit Product' : 'Add New Product'}
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
//               label="Price"
//               name="price"
//               type="number"
//               value={formData.price}
//               onChange={handleChange}
//               fullWidth
//               inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
//             />
//             <TextField
//               label="Sell Price"
//               name="sell_price"
//               type="number"
//               value={formData.sell_price}
//               onChange={handleChange}
//               fullWidth
//               inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
//             />
//             <TextField
//               label="Quantity"
//               name="quantity"
//               type="number"
//               value={formData.quantity}
//               onChange={handleChange}
//               fullWidth
//               inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
//             />
//             <TextField
//               label="Category ID"
//               name="category_id"
//               type="number"
//               value={formData.category_id}
//               onChange={handleChange}
//               fullWidth
//               inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
//             />
//           </Stack>
//           <Stack direction="row" spacing={2} mt={3}>
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={loading}
//               startIcon={loading && <CircularProgress size={20} />}
//             >
//               {loading ? 'Submitting...' : 'Submit'}
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
import React, { useRef, useState, useEffect, useCallback } from 'react';

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

// import { TableNoData } from '../table-no-data';
// import { UserTableRow } from '../user-table-row';
// import { UserTableHead } from '../user-table-head';
// import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { fetchData, handleConfirmDelete } from '../../apiService';
// import { emptyRows, emptyRowsv2, applyFilter, getComparator } from '../utils';

import { ProductModal } from './ProductModal';
import { ProductTable } from './ProductTable';
// Define the structure of a user and the response

interface User {
  id?: string;
  name: string;
  price: number;
  sell_price: number;
  quantity: number;
  category_id: number; // إضافة category_id
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

  const fetchCategories = async () => {
    try {
      const response = await fetchData<Category>(
        `${import.meta.env.VITE_API_BASE_URL}/api/Filtercategories`,
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
        };

        const { data, per_page, total } = await fetchData<User>(
          `${import.meta.env.VITE_API_BASE_URL}/api/products`,
          params
        );

        setUsers(data);
        setRowsPerPage(per_page);
        setTotalUsers(total);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    [selectedCategory]
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
      setFormData(product);
    } else {
      setFormData({
        id: '',
        name: '',
        price: 0,
        sell_price: 0,
        quantity: 0,
        category_id: 0,
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Convert string fields to numbers for the payload
      const { id, name, price, sell_price, quantity, category_id } = formData!;

      const payload = {
        name,
        price: Number(price),
        sell_price: Number(sell_price),
        quantity: Number(quantity),
        category_id: Number(category_id),
      };

      const url = id
        ? `http://192.168.1.9:3000/api/product/${id}`
        : 'http://192.168.1.9:3000/api/product';
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
                apiEndpoint: `${import.meta.env.VITE_API_BASE_URL}/api/product`,
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
