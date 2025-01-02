import React from 'react';

import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

interface ProductTableProps {
  users: any[];
  page: number;
  rowsPerPage: number;
  totalUsers: number;
  onEdit: (product: any) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  onSelectItem: (itemId: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  users,
  page,
  rowsPerPage,
  totalUsers,
  onEdit,
  onDelete,
  onPageChange,
  onSelectItem,
}) => {
  const handleCheckboxChange = (itemId: number) => {
    onSelectItem(itemId); // Call the handleSelectItem function when a checkbox is clicked
  };
  const handlePageChange = (_: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Sell Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.price}</TableCell>
                <TableCell>{user.sell_price}</TableCell>
                <TableCell>{user.quantity}</TableCell>
                <TableCell>
                  <Stack
                    direction={{ xs: 'row', sm: 'row' }} // Keep buttons inline for all screen sizes
                    spacing={1} // Add spacing between buttons
                    justifyContent="flex-start" // Adjust alignment as needed
                  >
                    <IconButton color="primary" onClick={() => onEdit(user)}>
                      <Iconify icon="eva:edit-2-outline" />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(user.id)}>
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        component="div"
        count={totalUsers}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        rowsPerPageOptions={[10]}
      /> */}
    </>
  );
};
