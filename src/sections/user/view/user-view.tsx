import axios from 'axios';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

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
  username: string;
  phone: string;
  role: string;
}

interface UserResponse {
  data: User[];
  current_page: number;
  per_page: number;
  total: number;
}

export function UserView() {
  const [filterName, setFilterName] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selected, setSelected] = useState<string[]>([]); // New state for selected rows

  const fetchUsers = async (p = 1) => {
    try {
      const response = await axios.get<UserResponse>(`http://192.168.1.3:3000/api/users?page=${p}`);
      const { data, per_page, total } = response.data;
      setUsers(data);
      setRowsPerPage(per_page);
      setTotalUsers(total);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers(page + 1);
  }, [page]);

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSelectAllRows = (checked: boolean) => {
    if (checked) {
      setSelected(users.map((user) => user.id)); // Select all users
    } else {
      setSelected([]); // Deselect all users
    }
  };

  const handleSelectRow = (id: string) => {
    setSelected(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((selectedId) => selectedId !== id) // Deselect the row
          : [...prevSelected, id] // Select the row
    );
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator('asc', 'name'),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Users
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New user
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={selected.length} // Update based on selection
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            setPage(0); // Reset to the first page when filter changes
          }}
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
                onSelectAllRows={handleSelectAllRows} // This will pass the checked boolean directly
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'username', label: 'Username' },
                  { id: 'phone', label: 'Phone' },
                  { id: 'role', label: 'Role' },
                  { id: '' },
                ]}
              />

              <TableBody>
                {dataFiltered.map((row) => (
                  <UserTableRow
                    key={row.id}
                    row={row}
                    selected={selected.includes(row.id)} // Check if the row is selected
                    onSelectRow={() => handleSelectRow(row.id)} // Handle row selection
                  />
                ))}

                {emptyRowsv2(page, rowsPerPage, totalUsers) > 0 && (
                  <TableEmptyRows
                    height={68}
                    emptyRows={emptyRowsv2(page, rowsPerPage, totalUsers)}
                  />
                )}

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
    </DashboardContent>
  );
}
